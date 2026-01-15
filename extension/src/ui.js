import { getColor, parseMarkdown } from './utils.js';

export function renderBadge(decision) {
    let colorVar = decision === 'HIRE' ? 'var(--primary)' : (decision === 'PASS' ? 'var(--success)' : 'var(--danger)');
    return `<span style="color: ${colorVar}; font-weight: 700; font-size: 14px;">${decision}</span>`;
}

export function renderScoreCard(label, score, decision) {
    const color = getColor(score);
    const dashArray = `${score}, 100`; 
    
    return `
    <div class="card" style="display:flex; align-items:center; gap: 16px;">
        <div style="width: 60px; height: 60px; flex-shrink: 0;">
            <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="circle" stroke="${color}" stroke-dasharray="${dashArray}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="23.35" style="font-size:13px" class="percentage">${score}</text>
            </svg>
        </div>
        <div style="flex:1;">
            <span class="section-label" style="margin-bottom:4px;">${label}</span>
            <div style="font-weight: 500; font-size: 13px; color: var(--text-muted);">
                Result: ${renderBadge(decision)}
            </div>
        </div>
    </div>
    `;
}

export function getTabContentHTML(tabName, currentResult) {
    if (tabName === 'ats') {
        const data = currentResult.ats_result;
        return `
            ${renderScoreCard("ATS Match Score", data.match_score, data.decision)}
            <div class="card">
                <span class="section-label">Missing Keywords</span>
                <div class="pill-wrap">
                    ${data.missing_keywords.length ? 
                      data.missing_keywords.map(k => `<span class="pill pill-danger">${k}</span>`).join('') : 
                      '<span class="pill pill-success">All Keywords Found</span>'}
                </div>
            </div>
            <div class="card">
                <span class="section-label">Formatting Check</span>
                ${data.formatting_issues && data.formatting_issues.length > 0 ? 
                  `<ul class="markdown-body" style="color: var(--danger)">${data.formatting_issues.map(i => `<li>${i}</li>`).join('')}</ul>` : 
                  '<div class="pill-wrap"><span class="pill pill-success">No Formatting Errors</span></div>'}
            </div>
            <div class="card">
                <span class="section-label">Detailed Feedback</span>
                <div class="markdown-body">${parseMarkdown(data.feedback)}</div>
            </div>
        `;
    } 
    else if (tabName === 'recruiter') {
        const data = currentResult.recruiter_result;
        return `
            ${renderScoreCard("Career Progression", data.career_progression_score, data.decision)}
            ${data.red_flags && data.red_flags.length > 0 ? `
            <div class="card" style="border-left: 3px solid var(--danger);">
                <span class="section-label" style="color: var(--danger)">🚩 Red Flags Detected</span>
                <ul class="markdown-body">${data.red_flags.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>` : ''}
            <div class="card">
                <span class="section-label">Soft Skills</span>
                <div class="pill-wrap">
                    ${data.soft_skills_detected.map(s => `<span class="pill pill-neutral">${s}</span>`).join('')}
                </div>
            </div>
            <div class="card">
                <span class="section-label">Recruiter Impressions</span>
                <div class="markdown-body">${parseMarkdown(data.feedback)}</div>
            </div>
        `;
    } 
    else if (tabName === 'hm') {
        const data = currentResult.hm_result;
        return `
            <div class="card hero-stats">
                <div>
                    <span class="section-label">Tech Depth</span>
                    <div style="font-size: 24px; font-weight: 800; color: ${getColor(data.tech_depth_score)}">${data.tech_depth_score}</div>
                </div>
                <div style="width: 1px; height: 30px; background: var(--border);"></div>
                <div>
                    <span class="section-label">Impact</span>
                    <div style="font-size: 24px; font-weight: 800; color: ${getColor(data.project_impact_score)}">${data.project_impact_score}</div>
                </div>
                <div>${renderBadge(data.decision)}</div>
            </div>
            <div class="card">
                <span class="section-label">Stack Alignment</span>
                <div class="markdown-body" style="font-style: italic; border-left: 3px solid var(--primary); padding-left: 12px; color: var(--text-muted);">
                    ${data.stack_alignment}
                </div>
            </div>
            <div class="card">
                <span class="section-label">Engineering Lead Notes</span>
                <div class="markdown-body">${parseMarkdown(data.feedback)}</div>
            </div>
        `;
    }
}