<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Custom Skills Trigger Feedback

Whenever a custom skill (like `brainstorming`, `ponytail`, `design-taste-frontend`, `verification-before-completion`, or `systematic-debugging`) is active or guiding your response:
1. Start your response with a clear header/badge to confirm the skill is active, for example: `⚡ **[SKILL: <skill_name>]**` or `🎨 **[SKILL: design-taste-frontend]**`.
2. If the user types `/vibe-coding`, `@vibe-coding`, `/brainstorming`, or `@brainstorming`, treat it as an explicit trigger to load and run the `brainstorming` skill.
