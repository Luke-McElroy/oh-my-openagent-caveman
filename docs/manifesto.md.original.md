# Manifesto

Principles and philosophy behind Oh My OpenAgent.

---

## Human Intervention is Failure Signal

**HUMAN IN THE LOOP = BOTTLENECK**

Think about autonomous driving. When human has to take over wheel, that's not feature. It's failure of system. Car couldn't handle situation on its own.

**Why is coding any different?**

When you find yourself:
- Fixing AI's half-finished code
- Manually correcting obvious mistakes
- Guiding agent step-by-step through task
- Repeatedly clarifying same requirements

That's not "human-AI collaboration." That's AI failing to do its job.

**Oh My OpenAgent is built on this premise**: Human intervention during agentic work is fundamentally wrong signal. If system is designed correctly, agent should complete work without requiring you to babysit it.

---

## Indistinguishable Code

**Goal: Code written by agent should be indistinguishable from code written by senior engineer.**

Not "AI-generated code that needs cleanup." Not "good starting point." Actual, final, production-ready code.

This means:
- Following existing codebase patterns exactly
- Proper error handling without being asked
- Tests that actually test right things
- No AI slop (over-engineering, unnecessary abstractions, scope creep)
- Comments only when they add value

If you can tell whether commit was made by human or agent, agent has failed.

---

## Token Cost vs Productivity

**Higher token usage is acceptable if it significantly increases productivity.**

Using more tokens to:
- Have multiple specialized agents research in parallel
- Get job done completely without human intervention
- Verify work thoroughly before completion
- Accumulate knowledge across tasks

That's worthwhile investment when it means 10x, 20x, or 100x productivity gains.

**However:**

Unnecessary token waste is not pursued. System optimizes for:
- Using cheaper models (Haiku, Flash) for simple tasks
- Avoiding redundant exploration
- Caching learnings across sessions
- Stopping research when sufficient context is gathered

Token efficiency matters. But not at cost of work quality or human cognitive load.

---

## Minimize Human Cognitive Load

**Human should only need to say what they want. Everything else is agent's job.**

Two approaches achieve this:

### Approach 1: Prometheus (Interview Mode)

You say: "I want to add authentication."

Prometheus:
- Researches your codebase to understand existing patterns
- Asks clarifying questions based on actual findings
- Surfaces edge cases you hadn't considered
- Documents decisions as you make them
- Generates complete work plan

**You provide intent. Agent provides structure.**

### Approach 2: Ultrawork (Do It Mode)

You say: "ulw add authentication"

Agent:
- Figures out right approach
- Researches best practices
- Implements following conventions
- Verifies everything works
- Keeps going until complete

**You provide intent. Agent handles everything.**

In both cases, human's job is to **express what they want**, not to manage how it gets done.

---

## Predictable, Continuous, Delegatable

**Ideal agent should work like compiler**: markdown document goes in, working code comes out.

### Predictable

Given same inputs:
- Same codebase patterns
- Same requirements
- Same constraints

Output should be consistent. Not random, not surprising, not "creative" in ways you didn't ask for.

### Continuous

Work should survive interruptions:
- Session crashes? Resume with `/start-work`
- Need to step away? Progress is tracked
- Multi-day project? Context is preserved

Agent maintains state. You don't have to.

### Delegatable

Like you can assign task to capable team member and trust them to handle it, you should be able to delegate to agent.

This means:
- Clear acceptance criteria, verified independently
- Self-correcting behavior when something goes wrong
- Escalation (to Oracle, to user) only when truly needed
- Complete work, not "mostly done"

---

## Core Loop

```
Human Intent → Agent Execution → Verified Result
       ↑                              ↓
       └──────── Minimum ─────────────┘
          (intervention only on true failure)
```

Everything in Oh My OpenAgent is designed to make this loop work:

| Feature | Purpose |
|---------|---------|
| Prometheus | Extract intent through intelligent interview |
| Metis | Catch ambiguities before they become bugs |
| Momus | Verify plans are complete before execution |
| Orchestrator | Coordinate work without human micromanagement |
| Todo Continuation | Force completion, prevent "I'm done" lies |
| Category System | Route to optimal model without human decision |
| Background Agents | Parallel research without blocking user |
| Wisdom Accumulation | Learn from work, don't repeat mistakes |

---

## What This Means in Practice

**You should be able to:**

1. Describe what you want (high-level or detailed, your choice)
2. Let agent interview you if needed
3. Confirm plan (or let ultrawork handle it)
4. Walk away
5. Come back to completed, verified, production-ready work

**If you can't do this, something in system needs improvement.**

---

## Future We're Building

World where:
- Human developers focus on **what** to build, not **how** to get AI to build it
- Code quality is independent of who (or what) wrote it
- Complex projects are as easy as simple ones (take longer)
- "Prompt engineering" becomes as obsolete as "compiler debugging"

**Agent should be invisible.** Not in sense that it's hidden, but in sense that it works. Like electricity, like running water, like internet.

You flip switch. Light turns on. You don't think about power grid.

That's goal.

---

## Further Reading

- [Overview](./guide/overview.md)
- [Orchestration Guide](./guide/orchestration.md)
