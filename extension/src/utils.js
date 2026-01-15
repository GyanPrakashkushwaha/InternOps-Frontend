export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function parseMarkdown(text) {
    if (!text) return "";
    let clean = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\d+\.\s/g, '<br><br>• ')
        .replace(/\n/g, '<br>');
    return clean;
}

export function getColor(score) {
    if (score >= 90) return 'var(--success)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--danger)';
}