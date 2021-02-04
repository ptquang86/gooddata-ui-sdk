// (C) 2020-2021 GoodData Corporation
import {
    IAnalyticalBackend,
    IPreparedExecution,
    isWidget,
    widgetId,
    widgetUri,
    layoutWidgets,
    FilterContextItem,
} from "@gooddata/sdk-backend-spi";
import {
    useBackend,
    useWorkspace,
    GoodDataSdkError,
    UseCancelablePromiseState,
    UnexpectedSdkError,
} from "@gooddata/sdk-ui";
import { ObjRef, areObjRefsEqual, objRefToString } from "@gooddata/sdk-model";
import invariant from "ts-invariant";
import { useDashboard } from "./useDashboard";
import { useKpiExecution } from "./useDashboardKpiExecution";
import { useInsightExecution } from "./useDashboardInsightExecution";
import { useDashboardViewLayout } from "./useDashboardViewLayout";

/**
 * @alpha
 */
export interface IUseDashboardWidgetExecutionConfig {
    /**
     * Reference to the dashboard that contains target widget.
     */
    dashboard: ObjRef;

    /**
     * Reference to the widget to get.
     */
    widget: ObjRef;

    /**
     * Optionally specify filters to merge into the execution.
     */
    filters?: FilterContextItem[];

    /**
     * Backend to work with.
     *
     * Note: the backend must come either from this property or from BackendContext. If you do not specify
     * backend here, then the hook MUST be called within an existing BackendContext.
     */
    backend?: IAnalyticalBackend;

    /**
     * Workspace where the insight exists.
     *
     * Note: the workspace must come either from this property or from WorkspaceContext. If you do not specify
     * workspace here, then the hook MUST be called within an existing WorkspaceContext.
     */
    workspace?: string;
}

/**
 * Hook allowing to get execution for particular dashboard widget.
 * @param config - configuration of the hook
 * @beta
 */
export function useDashboardWidgetExecution({
    dashboard,
    widget: widgetRef,
    filters,
    backend,
    workspace,
}: IUseDashboardWidgetExecutionConfig): UseCancelablePromiseState<IPreparedExecution, GoodDataSdkError> {
    const effectiveBackend = useBackend(backend);
    const effectiveWorkspace = useWorkspace(workspace);

    invariant(
        effectiveBackend,
        "The backend in useWidgetExecution must be defined. Either pass it as a config prop or make sure there is a BackendProvider up the component tree.",
    );

    invariant(
        effectiveWorkspace,
        "The workspace in useWidgetExecution must be defined. Either pass it as a config prop or make sure there is a WorkspaceProvider up the component tree.",
    );

    const { result: dashboardResult, status: dashboardStatus, error: dashboardError } = useDashboard({
        dashboard,
        backend: effectiveBackend,
        workspace: effectiveWorkspace,
    });
    const {
        result: dashboardViewLayoutResult,
        status: dashboardViewLayoutStatus,
        error: dashboardViewLayoutError,
    } = useDashboardViewLayout({
        dashboardLayout: dashboardResult?.layout,
        backend: effectiveBackend,
        workspace: effectiveWorkspace,
    });

    const widget =
        dashboardResult?.layout &&
        layoutWidgets(dashboardResult.layout)
            .filter(isWidget)
            .find((w) => {
                return areObjRefsEqual(widgetRef, {
                    uri: widgetUri(w),
                    identifier: widgetId(w),
                });
            });

    if (dashboardResult?.layout && !widget) {
        throw new UnexpectedSdkError(
            `Widget with ObjRef ${objRefToString(widget)} not found on the referenced dashboard.`,
        );
    }

    const kpiWidget = widget?.type === "kpi" ? widget : undefined;
    const insightWidget = widget?.type === "insight" ? widget : undefined;

    const kpiExecution = useKpiExecution({
        kpiWidget,
        filterContext: dashboardResult?.filterContext,
        filters,
        backend: effectiveBackend,
        workspace: effectiveWorkspace,
    });

    const insightExecution = useInsightExecution({
        insightWidget,
        insight: dashboardViewLayoutResult?.getInsightByRef(insightWidget?.insight),
        filters,
        filterContext: dashboardResult?.filterContext,
        backend: effectiveBackend,
        workspace: effectiveWorkspace,
    });

    const { result: executionResult, status: executionStatus, error: executionError } =
        widget?.type === "kpi" ? kpiExecution : insightExecution;

    const statuses = [dashboardStatus, dashboardViewLayoutStatus, executionStatus];
    const error = dashboardError ?? dashboardViewLayoutError ?? executionError;

    if (error) {
        return {
            error,
            result: undefined,
            status: "error",
        };
    } else if (statuses.some((s) => s === "loading")) {
        return {
            error: undefined,
            result: undefined,
            status: "loading",
        };
    }
    return {
        error: undefined,
        result: executionResult,
        status: "success",
    };
}
