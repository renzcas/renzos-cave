# Cave Physics Experiments II and III

These are reproducible computational toy models, not tests of a physical law. They make two proposed mechanisms explicit enough to vary parameters and compare against controls. Both use only the Python standard library.

## Run

```bash
python3 backend-python/cave_experiments.py
```

Defaults: a 31 by 31 blank grid, 80 rounds of 12 agents for the single-run view, 100 paired Experiment II seeds, and 100 replicates of a 200-step feedback sweep for Experiment III. Results go to `cave_experiment_results/` as JSON summaries, CSV metrics, and SVG plots. The command accepts `--size`, `--rounds`, `--agents-per-round`, `--steps`, `--replicates`, `--seed`, `--multi-seed-count`, `--multi-seed-start`, and `--output-dir`.

Run the focused tests:

```bash
python3 -m unittest discover -s backend-python -p 'test_cave_experiments.py' -v
```

The default CLI also runs 100 paired Experiment II seeds (seed IDs 1000-1099) and 100 Experiment III replicates. Override them with `--multi-seed-count`, `--multi-seed-start`, and `--replicates`. Generated batch artifacts are written only to the selected output directory and are not source files.

### Multi-Seed Output Schema

`multi_seed_records.csv` contains exactly one row per independent seed. Its fields include the seed and geodesic length; paired concentration, resistance-change, and efficiency effects; treatment/control resistance changes; mean selected route lengths; excess steps, stretch, efficiency, detour rates, and channel-persistence difference. `multi_seed_summary.json` records run parameters, each aggregate mean, sample standard deviation, two-sided 95% Student-$t$ interval, test method and raw p-value, plus Holm-adjusted primary p-values and Benjamini-Hochberg-adjusted secondary p-values. `multi_seed_aggregate.csv` is the flat table form of those aggregate outcomes. `multi_seed_dashboard.svg` combines the paired-effect distributions, stretch/efficiency distributions, primary confidence intervals, and the Experiment III validation-divergence sweep with its interval band and threshold tolerance.

## Experiment II: Agent Memory Residue

Each agent follows a minimum-resistance route across a four-neighbor blank grid between opposite corners. Both corners admit many equally short geometric routes. After selecting a route, the agent increments traffic and residue on every visited cell. Agents run sequentially, allowing later agents to respond to earlier trails.

For cell $i$, residue and movement resistance are:

$$
S_i(t+1) = S_i(t) + \mathbf{1}[i \text{ is traversed at } t], \qquad
c_i(t) = \frac{1}{1 + \beta \log(1 + S_i(t))}.
$$

The treatment chooses a path $p$ minimizing $\sum_{i \in p} c_i(t)$. The no-feedback control also records residue, but ignores it when routing; all cells retain unit resistance and ties among shortest paths are seed-randomized. Thus the comparison isolates whether residue affects future routing, without comparing treatment routes to potentially longer random walks.

Reported measures:

- **Traffic-residue Pearson correlation:** a bookkeeping check. Here residue equals traffic exactly, so correlation of 1 is expected and is not independent evidence for highway formation.
- **Channel concentration:** Herfindahl index $C=\sum_i (v_i / \sum_j v_j)^2$ across visited non-endpoint cells, where $v_i$ is traffic. The primary contrast is $\Delta C=C_{\mathrm{treatment}}-C_{\mathrm{control}}$.
- **Mean route resistance:** selected path cost divided by traversed edges, reported per round. It is 1 on a fresh grid and stays 1 in the no-feedback control.
- **Corridor persistence:** the Jaccard overlap between the top 10% most-trafficked non-endpoint cells in the first and second halves of the run.
- **Geodesic and detour metrics:** for each route, $L_g=2(N-1)$ is its shortest Manhattan length and $L_a$ is its selected number of moves. Excess steps are $E=L_a-L_g$; stretch is $S=L_a/L_g$; efficiency is $\eta=L_g/L_a$. By construction, $E\geq0$, $S\geq1$, and $0<\eta\leq1$. Detour rate is the fraction of routes with $E>0$, and geodesic route fraction is $1-$detour rate.

Positive $\Delta C$ means paths concentrate more under the chosen residue-aware rule. It does not by itself establish statistical significance. The model assumes permanent, non-decaying residue and does not model asphalt, geological strata, or environmental erosion.

## Revised Methods Section (Draft)

Experiment II was implemented as a discrete-time, multi-agent routing model on an obstacle-free $N\times N$ square lattice with four-neighbor connectivity. In each round, agents traveled sequentially from the upper-left to the lower-right corner, allowing later agents to observe residue deposited by earlier traversals. At each visited cell, traffic and residue increased by one. The adaptive treatment selected a minimum-cost path using $c_i(t)=[1+\beta\log(1+S_i(t))]^{-1}$; the control accumulated the same residue but used unit cell costs, with randomized tie-breaking among shortest paths. Thus, the control was a randomized geodesic baseline, not an unconstrained random walk. The primary outcome was the per-run traffic-concentration contrast $\Delta C$. Secondary outcomes were mean route resistance, corridor persistence, and route geometry. For each traversal, geodesic length $L_g$, selected length $L_a$, excess steps $E=L_a-L_g$, stretch $S=L_a/L_g$, efficiency $\eta=L_g/L_a$, and detour status were recorded independently of resistance. This allowed route quality and path reinforcement to vary separately rather than treating a lower resistance as evidence of a shorter route.

Experiment III used a synthetic three-dimensional unit-vector state and a feedback coefficient $\alpha$ swept from 0 to 1 in increments of 0.05. Model and sensory innovations were sampled independently from zero-mean isotropic Gaussian distributions with standard deviations $\sigma_m$ and $\sigma_y$. Each replicate used the same seed across feedback levels to support paired comparisons. At $\alpha=1$, the sensory term was clamped out; at $\alpha=0$, the model term was ignored. Outcomes were mean and final cosine divergence from the baseline, mean distance to a fixed synthetic validation set, quantized-state repetition frequency, and the pre-normalization injected-noise variance ratio $\Lambda(\alpha)$. The reported drift threshold was operationally defined as the first sampled $\alpha$ where mean validation divergence exceeded the prespecified tolerance of 0.08. This is a threshold in this synthetic model, not an empirical threshold for hallucination in language models or biological observers.

## Experiment III: Recursive Feedback Stress Test

The state $s_t$ is a unit vector in a synthetic three-dimensional space, not text or a language-model embedding. Let $Q_\phi$ rotate about the third axis by angle $\phi$, and let $b=(1,0,0)$. Independent noise vectors are drawn as $\epsilon^m_t\sim\mathcal{N}(0,\sigma_m^2 I)$ and $\epsilon^y_t\sim\mathcal{N}(0,\sigma_y^2 I)$. The implemented update is:

$$
\tilde{s}_{t+1}=\operatorname{normalize}(Q_\phi s_t+\epsilon^m_t), \qquad
 y_t=\operatorname{normalize}(b+\epsilon^y_t), \qquad
 s_{t+1}=\operatorname{normalize}\left(\alpha\tilde{s}_{t+1}+(1-\alpha)y_t\right).
$$

Here $\alpha\in[0,1]$ is self-feedback. At $\alpha=1$, the sensory term is clamped out; at $\alpha=0$, the model output has no influence. Before the final normalization, the two weighted noise contributions have variances $\alpha^2\sigma_m^2$ and $(1-\alpha)^2\sigma_y^2$. The reported pre-normalization injected-noise ratio is:

$$
\Lambda(\alpha)=\frac{\alpha^2\sigma_m^2}{(1-\alpha)^2\sigma_y^2+10^{-12}}.
$$

For positive noise scales, equal injected variances occur at $\alpha=\sigma_y/(\sigma_m+\sigma_y)$. This is an analytic noise-balance point, not a semantic hallucination threshold; normalization and deterministic rotation also affect state trajectories.

The sweep reports replicate means and standard deviations for final and mean cosine distance from the baseline, mean nearest-prototype cosine distance on a small synthetic validation set, and the fraction of time-quantized state vectors (rounded to 0.01) that have appeared before. Repetition can indicate a stable attractor rather than an error. The reported `estimated_critical_feedback` is the first sampled feedback value where mean validation divergence exceeds the configured tolerance (default 0.08). It is model-specific and resolved only to the feedback sweep interval (0.05 by default).

These vector measures do not establish semantic drift in an LLM. That would require a fixed model and task protocol, a held-out task-specific validation set, and validated semantic scoring or blinded human ratings.

## Validation Matrix

| Claim / hypothesis | Primary measure and prediction | Falsification or failure condition | Status |
| --- | --- | --- | --- |
| H1: Traversal deposits residue | Residue increases at each visited cell; total residue equals total visits. | A visit fails to increment its cell, or residue accounting does not equal traffic. | Verified as an implementation invariant; not an empirical law. |
| H2: Residue changes future flow | $\Delta C=C_T-C_C>0$ across independent seeds. | Seed-level interval includes zero or the effect reverses under preregistered settings. | Positive in the default seeded run; multi-seed inference pending. |
| H3: Corridors persist | Top-decile early/late traffic-cell Jaccard overlap exceeds the no-feedback control. | No increase in overlap, or traffic remains diffuse under the preregistered threshold. | Measured by the runner; comparative multi-seed test pending. |
| H4: Use reduces route resistance | Treatment mean route resistance falls from early to late rounds; control remains at unit resistance. | Treatment trend is non-decreasing or control changes despite no-feedback routing. | Verified in the default seeded run and unit test; multi-seed inference pending. |
| H5: Geodesic routes are preserved | $E=0$, $S=1$, $\eta=1$; report route-level detours without inferring from resistance. | Detour rate rises above the preregistered tolerance or efficiency falls below it. | Directly instrumented and checked on the smoke configuration; full parameter sensitivity pending. |
| H6: Feedback produces a drift regime | Validation divergence exceeds its fixed tolerance at some $\alpha$; report $\Lambda$ and the analytic variance crossover separately. | No crossing occurs, or threshold location is unstable across seeds/noise settings. | A model-specific crossing is produced; robustness and semantic validity pending. |
| Reproducibility | Fixed inputs and seed reproduce metrics exactly. | Repeated executions differ. | Verified by unit test. |
| Null and noise calibration | $\beta=0$ gives identical treatment/control traffic; noise ratio matches injected noise scales. | Null changes routes or ratio/crossover disagree with formulas. | Verified by unit tests. |

The terms **verified** and **pending** here describe code invariants or current evidence scope, not confirmation of a general Cave Physics law.

## Multi-Seed Results (Exploratory)

The default batch was run with 100 paired seeds (1000-1099), a $31\times31$ grid, 80 rounds, 12 agents per round, and wear strength $\beta=0.35$. Results are conditional on this implementation and parameter set.

| Primary paired outcome | Mean effect (SD) | 95% interval | Raw p | Holm-adjusted p | Method |
| --- | ---: | ---: | ---: | ---: | --- |
| Traffic concentration, $\Delta C$ | 0.0142488 (0.0000281) | [0.0142432, 0.0142544] | $3.58\times10^{-270}$ | $1.07\times10^{-269}$ | Paired Student-$t$ |
| Resistance change, $\Delta R$ | -0.358154 (0) | [ -0.358154, -0.358154 ]* | $7.89\times10^{-31}$ | $1.58\times10^{-30}$ | Exact sign fallback; zero between-seed variance |
| Efficiency difference, $\Delta\eta$ | 0 (0) | [0, 0]* | 1 | 1 | Degenerate zero outcome |

No treatment or control route detoured in these 100 runs: mean selected length equaled the Manhattan geodesic, treatment stretch and efficiency were both 1, and excess steps were 0 for every seed. The mean paired control-adjusted resistance change was -0.358154. The secondary early/late corridor-persistence contrast was 0.261746 (SD 0.056299; 95% interval [0.250575, 0.272917]; raw $p=2.30\times10^{-69}$; BH-adjusted $p=9.21\times10^{-69}$). Other tested secondary outcomes had zero observed detours/excess stretch.

Experiment III used 100 replicates and estimated the first feedback level exceeding the validation-divergence tolerance at $\alpha=0.85$ on a 0.05 grid; the injected-noise variance equality point was $\alpha=0.5$. The feedback threshold is a synthetic, grid-resolved candidate, not an LLM or biological hallucination threshold.

*The resistance and efficiency outcomes had exactly zero between-seed standard deviation, so the Student-$t$ interval collapses to a point and is not an informative uncertainty interval. The resistance p-value uses the exact sign fallback and indicates sign consistency under its null assumptions; the repeated identical magnitude shows this setup has no observed seed-level variability for that endpoint. Efficiency was identically unchanged. Do not interpret these degenerate intervals as evidence of high precision or generalize beyond this fixed topology, routing policy, and parameter set. A richer environment/parameter sensitivity analysis is required to assess detours and uncertainty.

## Multi-Seed Analysis Plan

1. **Freeze the plan.** Before confirmatory runs, register grid size, rounds, agents per round, wear strength, feedback sweep, noise scales, validation tolerance, primary/secondary endpoints, direction of each test, smallest effect of interest, exclusion rules, and analysis code. Use separate pilot seeds to estimate between-seed variance and determine sample size for at least 80% power at family-wise $\alpha=0.05$ for the smallest effect of interest. Do not reuse pilot seeds in confirmatory results.
2. **Unit of analysis.** Treat each independent run seed as one observation. For Experiment II, run treatment and control with the same seed and calculate paired seed-level contrasts; cells, agents, and rounds are not independent replicates. Retain all seed-level values and report exclusions with reasons.
3. **Primary estimands.** For seed $i$, calculate concentration difference $d_{C,i}=C_{T,i}-C_{C,i}$. Calculate resistance difference-in-differences as $d_{R,i}=(R_{T,last,i}-R_{T,first,i})-(R_{C,last,i}-R_{C,first,i})$. Calculate each condition's mean route efficiency over all its routes, then $d_{\eta,i}=\bar{\eta}_{T,i}-\bar{\eta}_{C,i}$. The directional predictions are $E[d_C]>0$ and $E[d_R]<0$. Test $d_\eta$ two-sided against zero; a negative value indicates more detouring in treatment, while a non-significant difference alone does not establish geodesic preservation.
4. **Primary inference and intervals.** For each primary estimand, report the paired mean, standard deviation, and two-sided 95% Student-$t$ confidence interval, $\bar d\pm t_{0.975,n-1}s_d/\sqrt n$. Use paired one-sided $t$ tests for the preregistered directional hypotheses on $d_C$ and $d_R$, and a paired two-sided $t$ test for $d_\eta$. Apply Holm-Bonferroni across these three co-primary $p$ values to control family-wise error at 0.05. Also report unadjusted estimates and intervals; adjustment changes the decision threshold, not the estimated effect. Check paired-difference distributions and include a seed-bootstrap 95% interval and paired permutation test as robustness analyses if assumptions are doubtful.
5. **Secondary and geodesic analyses.** Treat excess steps, stretch, detour rate, channel width/persistence, path diversity, and network entropy as secondary. Report their seed-level estimates and 95% intervals; apply Benjamini-Hochberg correction across this exploratory family at false-discovery rate $q=0.05$. Evaluate geodesic preservation using seed-level treatment stretch against 1 with the preregistered one-sided alternative $E[S]>1$ for detours. If the desired claim is preservation within tolerance, define an efficiency/stretch equivalence margin before data collection and use two one-sided tests; failure to reject a difference from 1 is not evidence of equivalence.
6. **Experiment III.** Use replicate as the independent unit and common replicate seeds across $\alpha$ as repeated measures. Report mean curves and 95% seed-bootstrap intervals for validation divergence, repetition frequency, and $\Lambda$. Estimate a drift-threshold interval by resampling replicate trajectories and recomputing the first sampled $\alpha$ above the fixed validation tolerance. If a resampled curve never crosses, report that draw as not observed/censored rather than forcing a threshold. Repeat under prespecified $\sigma_m$, $\sigma_y$, and rotation-angle conditions. Keep the analytic variance-equality point $\alpha=\sigma_y/(\sigma_m+\sigma_y)$ distinct from the empirical drift threshold.
7. **Interpretation.** Report all estimates, intervals, adjusted and unadjusted $p$ values, and raw seed-level outcomes, including null or adverse results. Statistical outcomes from the synthetic vector process are not evidence of semantic hallucination in an LLM; that claim requires a separate task-validated LLM study.

## Interrupted-Run Limitation

The current command executes both experiments in memory and writes `summary.json`, CSV files, and SVG plots only after both complete. An interruption before output generation leaves no partial seed-level dataset and there is no checkpoint/resume mechanism. Do not treat an interrupted run as a zero result or include it as a completed seed; record the interruption, rerun that seed from its fixed configuration, and preserve the original run log. A future confirmatory runner should write one atomic record per completed seed and support validated resume without overwriting prior results.

## Assumptions and Scope

- The grid is finite, static in shape, obstacle-free, and has four-neighbor connectivity.
- Residue accumulates monotonically, changes future route costs, and has no decay, erosion, or resource budget.
- Agents share a source and destination and observe the current residue map without noise.
- Experiment III's rotation, Gaussian noise, normalization, validation prototypes, and threshold are synthetic choices, not derived from neurobiology or language-model behavior.
- The current tests establish implementation invariants and seeded toy outcomes, not population-level statistical evidence. Confirmatory claims need preregistered parameters, multiple independent seeds, uncertainty intervals, and sensitivity analysis.

## Related Work

These sources motivate comparisons; they do not validate Cave Physics or imply equivalence to the present simulations:

- Bejan, A., & Lorente, S. (2006). The constructal law and the evolution of design in nature. *Physics of Life Reviews, 3*(4), 209–244. https://doi.org/10.1016/j.plrev.2006.03.002
- Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience, 11*(2), 127–138. https://doi.org/10.1038/nrn2787
- Maturana, H. R., & Varela, F. J. (1980). *Autopoiesis and Cognition: The Realization of the Living*. D. Reidel Publishing Company.

Experiment II is an agent-based path-cost model, not a direct test of the Constructal Law. Experiment III is a generic recurrent dynamical system, not an implementation of the Free Energy Principle or an empirical test of autopoiesis.
