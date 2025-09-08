/**
 * 根据判断值决定要展示的字体颜色
 * @param text 展示值
 * @param judgeValue 判断值：要求是数值格式
 * @returns {*|string}
 */
export const getRedOrGreenColorHtml = (text, judgeValue, hasUnderline = false) => {
    judgeValue = Number(judgeValue) || 0
    if (judgeValue > 0) {
        if (hasUnderline) {
            return `<span style="color: var(--rose-color);font-weight: bold;text-decoration: underline;text-decoration-color: var(--rose-color);">${text}</span>`
        }
        return `<span style="color: var(--rose-color);font-weight: bold;">${text}</span>`
    } else if (judgeValue < 0) {
        if (hasUnderline) {
            return `<span style="color: var(--fell-color);font-weight: bold;text-decoration: underline;text-decoration-color: var(--fell-color);">${text}</span>`
        }
        return `<span style="color: var(--fell-color);font-weight: bold;">${text}</span>`
    } else {
        if (hasUnderline) {
            return `<span style="text-decoration: underline;">${text}</span>`
        }
        return text
    }
}