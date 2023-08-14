export const isInWidget = (overlaps, model) => {
    const { minLeft, minTop, minRight, minBottom } = overlaps;
    const widgets = model.widgets;
    const minLeftId = minLeft?.to?.id;
    const minTopId = minTop?.to?.id;
    const minRightId = minRight?.to?.id;
    const minBottomId = minBottom?.to?.id;

    if (minLeftId === minTopId && widgets[minLeftId]) {
        return minLeftId;
    } else if (minLeftId === minBottomId && widgets[minLeftId]) {
        return minLeftId;
    } else if (minRightId === minTopId && widgets[minRightId]) {
        return minRightId;
    } else if (minRightId === minBottomId && widgets[minRightId]) {
        return minRightId;
    }

}