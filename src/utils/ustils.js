/**
 * 根据判断值决定要展示的字体颜色
 * @param text 展示值
 * @param judgeValue 判断值：要求是数值格式
 * @returns {*|string}
 */
export const getRedOrGreenColorHtml = (text, judgeValue, hasUnderline) => {
    judgeValue = Number(judgeValue) || 0
    if (judgeValue > 0) {
        if (hasUnderline) {
            return `<div style="color: var(--rose-color);font-weight: bold;text-decoration: underline;text-decoration-color: var(--rose-color);">${text}</div>`
        }
        return `<div style="color: var(--rose-color);font-weight: bold;">${text}</div>`
    } else if (judgeValue < 0) {
        if (hasUnderline) {
            return `<div style="color: var(--fell-color);font-weight: bold;text-decoration: underline;text-decoration-color: var(--fell-color);">${text}</div>`
        }
        return `<div style="color: var(--fell-color);font-weight: bold;">${text}</div>`
    } else {
        if (hasUnderline) {
            return `<div style="text-decoration: underline;">${text}</div>`
        }
        return text
    }
}