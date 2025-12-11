import { Link } from "react-router-dom";

const MetricsExplained = () => {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
            {/* Header */}
            <header
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    padding: "32px 24px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                    <Link
                        to="/"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontSize: "14px",
                            opacity: 0.9,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            marginBottom: "16px",
                        }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: 700 }}>📊 Understanding Our Metrics</h1>
                    <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>How we measure and demonstrate developer productivity improvements</p>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
                {/* Introduction */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>Why These Metrics Matter</h2>
                    <p style={paragraphStyle}>
                        Demonstrating developer productivity improvements requires a combination of <strong>quantitative metrics</strong> that stakeholders can understand and trust. This dashboard combines data from two key sources:
                    </p>
                    <ul style={listStyle}>
                        <li>
                            <strong>GitHub Copilot Metrics API</strong> — Usage and adoption data showing how developers interact with AI assistance
                        </li>
                        <li>
                            <strong>Jira Sprint Data</strong> — Story point velocity and completion rates that represent actual work delivered
                        </li>
                    </ul>
                    <p style={paragraphStyle}>By correlating these data sources, we can establish a clear relationship between Copilot adoption and measurable productivity gains.</p>
                </section>

                {/* Metric 1: Productivity Increase */}
                <section style={sectionStyle}>
                    <div style={metricHeaderStyle}>
                        <span style={iconStyle}>📈</span>
                        <h2 style={{ ...headingStyle, margin: 0 }}>Productivity Increase</h2>
                    </div>
                    <div style={metricContentStyle}>
                        <h3 style={subheadingStyle}>What It Measures</h3>
                        <p style={paragraphStyle}>The percentage increase in average story points completed per sprint after developers adopt GitHub Copilot, compared to their baseline before adoption.</p>

                        <h3 style={subheadingStyle}>How It's Calculated</h3>
                        <div style={formulaStyle}>
                            <code>Productivity Increase = ((Velocity with Copilot - Velocity without Copilot) / Velocity without Copilot) × 100</code>
                        </div>
                        <p style={paragraphStyle}>We compare the average velocity (story points per sprint) of developers using Copilot against their historical velocity before adoption, or against developers not yet using Copilot.</p>

                        <h3 style={subheadingStyle}>Why It's Important</h3>
                        <ul style={listStyle}>
                            <li>
                                <strong>Direct business impact:</strong> More story points = more features delivered = faster time to market
                            </li>
                            <li>
                                <strong>ROI justification:</strong> Provides a clear percentage to calculate return on Copilot investment
                            </li>
                            <li>
                                <strong>Leadership-friendly:</strong> Easy to communicate to non-technical stakeholders
                            </li>
                        </ul>

                        <div style={tipStyle}>
                            💡 <strong>Industry benchmark:</strong> A{" "}
                            <a href="https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/" target="_blank" rel="noopener noreferrer" style={{ color: "#065f46" }}>
                                2022 GitHub study
                            </a>{" "}
                            found developers completed tasks 55% faster with Copilot. Our measurements validate this in your specific context.
                        </div>
                    </div>
                </section>

                {/* Metric 2: Acceptance Rate */}
                <section style={sectionStyle}>
                    <div style={metricHeaderStyle}>
                        <span style={iconStyle}>✅</span>
                        <h2 style={{ ...headingStyle, margin: 0 }}>Copilot Acceptance Rate</h2>
                    </div>
                    <div style={metricContentStyle}>
                        <h3 style={subheadingStyle}>What It Measures</h3>
                        <p style={paragraphStyle}>The percentage of Copilot code suggestions that developers accept and use in their work. This reflects how relevant and useful the AI suggestions are to developers.</p>

                        <h3 style={subheadingStyle}>How It's Calculated</h3>
                        <div style={formulaStyle}>
                            <code>Acceptance Rate = (Accepted Suggestions / Total Suggestions) × 100</code>
                        </div>
                        <p style={paragraphStyle}>GitHub's Copilot API provides these metrics directly, tracking every suggestion shown and whether the developer accepted, modified, or dismissed it.</p>

                        <h3 style={subheadingStyle}>Why It's Important</h3>
                        <ul style={listStyle}>
                            <li>
                                <strong>Quality indicator:</strong> High acceptance rates mean Copilot is providing relevant, useful suggestions
                            </li>
                            <li>
                                <strong>Adoption health:</strong> Low acceptance might indicate training needs or configuration issues
                            </li>
                            <li>
                                <strong>Time savings:</strong> Each accepted suggestion represents code that didn't need to be typed manually
                            </li>
                        </ul>

                        <div style={tipStyle}>
                            💡 <strong>What's a good rate?</strong> Acceptance rates of 25-35% are typical. Higher rates (40%+) indicate developers are highly proficient with Copilot prompting techniques.
                        </div>
                    </div>
                </section>

                {/* Metric 3: Team Adoption */}
                <section style={sectionStyle}>
                    <div style={metricHeaderStyle}>
                        <span style={iconStyle}>👥</span>
                        <h2 style={{ ...headingStyle, margin: 0 }}>Team Adoption</h2>
                    </div>
                    <div style={metricContentStyle}>
                        <h3 style={subheadingStyle}>What It Measures</h3>
                        <p style={paragraphStyle}>The number of developers actively using GitHub Copilot as a percentage of the total development team.</p>

                        <h3 style={subheadingStyle}>How It's Calculated</h3>
                        <div style={formulaStyle}>
                            <code>Adoption Rate = (Developers with Copilot / Total Developers) × 100</code>
                        </div>
                        <p style={paragraphStyle}>We track which developers have Copilot enabled and are actively using it (based on suggestion counts) in each sprint.</p>

                        <h3 style={subheadingStyle}>Why It's Important</h3>
                        <ul style={listStyle}>
                            <li>
                                <strong>Rollout tracking:</strong> Monitor progress of phased Copilot deployments
                            </li>
                            <li>
                                <strong>Identify gaps:</strong> Find teams or individuals who may need additional support or training
                            </li>
                            <li>
                                <strong>Maximize investment:</strong> Ensure licenses are being utilized effectively
                            </li>
                        </ul>

                        <div style={tipStyle}>
                            💡 <strong>Pro tip:</strong> Track adoption over time to see the natural spread of usage. Early adopters often help onboard their peers.
                        </div>
                    </div>
                </section>

                {/* Metric 4: Velocity */}
                <section style={sectionStyle}>
                    <div style={metricHeaderStyle}>
                        <span style={iconStyle}>⚡</span>
                        <h2 style={{ ...headingStyle, margin: 0 }}>Developer Velocity</h2>
                    </div>
                    <div style={metricContentStyle}>
                        <h3 style={subheadingStyle}>What It Measures</h3>
                        <p style={paragraphStyle}>The average number of story points a developer completes per sprint. This is a standard Agile metric that represents the rate at which work is delivered.</p>

                        <h3 style={subheadingStyle}>How It's Calculated</h3>
                        <div style={formulaStyle}>
                            <code>Velocity = Total Story Points Completed / Number of Sprints</code>
                        </div>
                        <p style={paragraphStyle}>We pull completed story points from Jira for each sprint and calculate per-developer and team-wide averages.</p>

                        <h3 style={subheadingStyle}>Why It's Important</h3>
                        <ul style={listStyle}>
                            <li>
                                <strong>Planning accuracy:</strong> Helps predict how much work can be completed in future sprints
                            </li>
                            <li>
                                <strong>Trend analysis:</strong> Identify if productivity is improving, stable, or declining
                            </li>
                            <li>
                                <strong>Comparison baseline:</strong> Essential for measuring the before/after impact of Copilot
                            </li>
                        </ul>

                        <div style={warningStyle}>
                            ⚠️ <strong>Important:</strong> Velocity should never be used to compare developers against each other. Story point estimation varies, and velocity is a planning tool, not a performance metric.
                        </div>
                    </div>
                </section>

                {/* Metric 5: Velocity Trend */}
                <section style={sectionStyle}>
                    <div style={metricHeaderStyle}>
                        <span style={iconStyle}>📉</span>
                        <h2 style={{ ...headingStyle, margin: 0 }}>Velocity Trend Over Time</h2>
                    </div>
                    <div style={metricContentStyle}>
                        <h3 style={subheadingStyle}>What It Measures</h3>
                        <p style={paragraphStyle}>The change in velocity across multiple sprints, comparing developers with Copilot against those without (or against historical baselines).</p>

                        <h3 style={subheadingStyle}>How It's Visualized</h3>
                        <p style={paragraphStyle}>The trend chart shows two lines over time: average velocity for Copilot users versus non-users. The gap between these lines demonstrates the productivity differential.</p>

                        <h3 style={subheadingStyle}>Why It's Important</h3>
                        <ul style={listStyle}>
                            <li>
                                <strong>Sustained impact:</strong> Shows that productivity gains persist over time, not just a novelty effect
                            </li>
                            <li>
                                <strong>Learning curve:</strong> Reveals how quickly developers become proficient with Copilot
                            </li>
                            <li>
                                <strong>Compelling visual:</strong> A growing gap between the lines tells a powerful story to stakeholders
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Metric 6: Developer Comparison */}
                <section style={sectionStyle}>
                    <div style={metricHeaderStyle}>
                        <span style={iconStyle}>👤</span>
                        <h2 style={{ ...headingStyle, margin: 0 }}>Developer Productivity Improvement</h2>
                    </div>
                    <div style={metricContentStyle}>
                        <h3 style={subheadingStyle}>What It Measures</h3>
                        <p style={paragraphStyle}>Individual developer velocity before and after Copilot adoption, showing the personal impact for each team member.</p>

                        <h3 style={subheadingStyle}>How It's Calculated</h3>
                        <div style={formulaStyle}>
                            <code>Improvement = ((After Velocity - Before Velocity) / Before Velocity) × 100</code>
                        </div>
                        <p style={paragraphStyle}>For each developer, we compare their average velocity in their first sprint (baseline) against their most recent sprint performance.</p>

                        <h3 style={subheadingStyle}>Why It's Important</h3>
                        <ul style={listStyle}>
                            <li>
                                <strong>Individual validation:</strong> Proves that improvements happen across the team, not just for certain individuals
                            </li>
                            <li>
                                <strong>Identify outliers:</strong> Find developers who may need additional support or are excelling
                            </li>
                            <li>
                                <strong>Success stories:</strong> Highlight top improvers to share their best practices
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Best Practices */}
                <section style={sectionStyle}>
                    <h2 style={headingStyle}>📋 Best Practices for Presenting These Metrics</h2>
                    <div style={{ display: "grid", gap: "16px" }}>
                        <div style={practiceCardStyle}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#059669" }}>✓ Do</h3>
                            <ul style={{ ...listStyle, marginBottom: 0 }}>
                                <li>Present trends over multiple sprints, not just snapshots</li>
                                <li>Combine quantitative data with qualitative developer feedback</li>
                                <li>Acknowledge other factors that may influence productivity</li>
                                <li>Use percentage improvements for executive summaries</li>
                                <li>Show the correlation between acceptance rate and velocity gains</li>
                            </ul>
                        </div>
                        <div style={{ ...practiceCardStyle, borderColor: "#dc2626" }}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#dc2626" }}>✗ Don't</h3>
                            <ul style={{ ...listStyle, marginBottom: 0 }}>
                                <li>Use velocity to rank or compare individual developers</li>
                                <li>Claim all productivity gains are solely due to Copilot</li>
                                <li>Ignore context (team changes, project complexity, etc.)</li>
                                <li>Focus only on metrics—developer satisfaction matters too</li>
                                <li>Present data without explaining the methodology</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section style={{ ...sectionStyle, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <h2 style={{ ...headingStyle, color: "white" }}>🎯 The Bottom Line</h2>
                    <p style={{ ...paragraphStyle, color: "white", opacity: 0.95 }}>
                        By tracking these metrics consistently, you can build a compelling, data-driven case for Copilot's impact on developer productivity. The key is combining <strong>Copilot usage data</strong> (adoption, acceptance rates) with <strong>business outcomes</strong> (velocity, story points delivered) to show the complete picture.
                    </p>
                    <p style={{ ...paragraphStyle, color: "white", opacity: 0.95, marginBottom: 0 }}>Remember: these metrics are tools for improvement, not judgment. Use them to celebrate wins, identify opportunities, and continuously optimize your team's development workflow.</p>
                </section>

                {/* Back to Dashboard */}
                <div style={{ textAlign: "center", marginTop: "32px" }}>
                    <Link
                        to="/"
                        style={{
                            display: "inline-block",
                            padding: "12px 24px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            fontSize: "16px",
                        }}>
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Footer */}
                <footer style={{ marginTop: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                    <p>Data sources: GitHub Copilot Metrics API & Jira REST API v3 | Mock data for demonstration purposes</p>
                </footer>
            </main>
        </div>
    );
};

// Styles
const sectionStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    marginBottom: "24px",
};

const headingStyle: React.CSSProperties = {
    margin: "0 0 16px 0",
    fontSize: "22px",
    fontWeight: 600,
    color: "#111827",
};

const subheadingStyle: React.CSSProperties = {
    margin: "20px 0 8px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "#374151",
};

const paragraphStyle: React.CSSProperties = {
    margin: "0 0 16px 0",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#4b5563",
};

const listStyle: React.CSSProperties = {
    margin: "0 0 16px 0",
    paddingLeft: "20px",
    lineHeight: 1.8,
    color: "#4b5563",
};

const metricHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
};

const metricContentStyle: React.CSSProperties = {
    paddingLeft: "8px",
};

const iconStyle: React.CSSProperties = {
    fontSize: "32px",
};

const formulaStyle: React.CSSProperties = {
    background: "#f3f4f6",
    padding: "16px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowX: "auto",
};

const tipStyle: React.CSSProperties = {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#065f46",
    marginTop: "16px",
};

const warningStyle: React.CSSProperties = {
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#92400e",
    marginTop: "16px",
};

const practiceCardStyle: React.CSSProperties = {
    background: "#f9fafb",
    border: "2px solid #059669",
    borderRadius: "8px",
    padding: "16px",
};

export default MetricsExplained;
