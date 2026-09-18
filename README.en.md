# FlyFund Arena

[한국어](README.md) | [English](README.en.md)

A **paper-trading only** dashboard that explores fruit-fly neural-network signals across the Magnificent Seven and SK hynix.

Assets: `NVDA`, `AAPL`, `MSFT`, `AMZN`, `GOOGL`, `META`, `TSLA`, `000660.KS`

## Current status

- Working daily-price collector with a local cache
- Reproducible backtests that execute only at the next market open
- Fly+Risk, Pure Fly, shuffled-network, Buy & Hold, moving-average and random comparisons
- Date replay, sensory charts, brain-region activity, individual votes and an audit trail
- Korean/English switching, dark/light themes and contextual help for metrics and brain regions
- Holiday carry-forward, split-adjusted OHLC data, USD/KRW conversion and equal fees across strategies
- A decision replay from market input to four votes, consensus, position size and next-session P&L
- A decision microscope that follows one fly through sensory input, reward and memory, brain activity, decoder competition and final action
- Associative-learning animations for sugar reward and aversive stimuli, with approach/avoidance, left/right motion and BUY/SELL labels kept separate
- Fly+Risk and Pure Fly paper books showing shares, stock value, cash, current weights and next-session targets for all eight assets
- One-, three- and five-year, maximum and custom performance ranges rebased to $100,000 at the selected start
- A latest-one-year default that moves forward automatically when market data is updated
- A contrast-enhanced 3D brain showing the most active regions, left/right DNp20 decoder neurons and the DNpe017 motor gate
- A decision workspace that aligns market candles, six sensory features and four fly votes beside the 3D brain
- A Fly Cup for individual fly signals and a counterfactual card comparing the selected weight with its opposite
- Refreshes every six hours while the server is running and fills missing data at startup
- No real-order code
- A verified Windows build of the Stonkfly C++17 kernel and full MaleCNS execution

Today's per-asset votes are calculated with the official full MaleCNS v1.0 graph and the Stonkfly C++ kernel. The four flies view 40, 70, 100 and 130 days of prices. Long-run league equity curves use the lower-cost `fly-proxy-v1` backtest and are labeled separately in the interface.

The decision microscope preserves that distinction. The latest MaleCNS run uses `learning=false`, so the dashboard states that reward is not injected into the real brain simulation and shows the left/right DNp20 firing rates and motor gate. Only historical proxy replay visualizes a learning loop that updates memory from the previous account return.

## Run locally

Only Node.js 20 or newer is required.

```powershell
npm.cmd test
npm.cmd start
```

Open <http://127.0.0.1:4173> in a browser.

## Free web deployment

Cloudflare Pages serves the static dashboard, while GitHub Actions refreshes market data and MaleCNS output after the Korean and U.S. market closes. The browser calculates the fixed-seed (`2`) proxy backtest from the published market snapshot.

1. Push this project to a GitHub repository.
2. Connect the repository in Cloudflare Pages.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Enable GitHub Actions. The `Refresh market and MaleCNS snapshot` workflow runs on weekdays around `16:17 KST` and `07:17 KST`, and it can also be started manually.

Never share a login password or personal access token. Approve access only through the official GitHub and Cloudflare OAuth screens. The first automated run can take longer because it downloads and converts the verified MaleCNS data.

To refresh prices once:

```powershell
npm.cmd run update
```

When the network is unavailable, the app starts with demo data and says so at the top of the page. Yahoo Finance's public chart endpoint is unofficial; replace it with a properly licensed provider for production use.

## Windows C++ kernel

WinLibs GCC 16.1.0 is installed at `C:\tools\flyfund-winlibs` on the development machine. Because MinGW can mishandle Korean characters in the project path, the build script copies the source to a temporary ASCII-only path before compiling.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-kernel.ps1
```

Output: `C:\tools\flyfund-build\memory.dll`

To prepare the official MaleCNS connectivity data (about a 1.1 GB download) and run a 10 ms smoke test:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\prepare-malecns.ps1
$env:PYTHONPATH="$PWD\vendor"
.\.venv\Scripts\python.exe .\scripts\malecns-smoke.py
```

The data is stored in `data/malecns` and is excluded from Git. Source files and converted arrays are verified against SHA-256 hashes from the upstream lock file.

## Automatic updates

While the server remains on, daily bars and MaleCNS decisions refresh at startup and every six hours. If the computer was off, the next startup downloads the latest five years and fills any missing period.

On Windows, the following script installs scheduled tasks for roughly `16:10 KST` after the Korean close and `07:10 KST` after the U.S. close. If a run is missed, Windows `StartWhenAvailable` starts it after the next login or boot.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-daily-task.ps1
npm.cmd run daily
```

## Experiment rules

- Signals use only information available through that day's close.
- Decisions execute at the next market open.
- No short selling or leverage.
- A 0.1% trading fee is applied equally to FlyFund and every benchmark.
- `Fly+Risk` uses one unified account in which the M7 and SK hynix compete for capital. Benchmark strategies use equal internal starting amounts only for fair per-asset normalization.
- SK hynix's KRW value is converted to USD with the daily USD/KRW rate.
- Initial paper capital is $100,000.
- `Pure Fly` starts each asset at 50% exposure. Two consecutive BUY or SELL majorities move exposure by 10 percentage points at the next open, within a 20–80% range. `Fly+Risk` allocates across assets using brain consensus, trend and volatility scores, adjusts total stock exposure across ten levels from 50% to 95%, caps each asset at 25%, and holds an allocation for at least three sessions.
- The holdings toggle switches between Fly+Risk and Pure Fly account value, cash, shares and weights. `Current stock exposure` is closing stock value divided by account value on the selected date. `Next target` applies at a later market open, so the two values can differ because of price moves and execution timing.
- The moving-average benchmark buys to 100% exposure at the next open when the 5-day adjusted-close average is above the 20-day average; otherwise it moves to 100% cash.
- The default experiment seed is fixed at `2` for reproducibility.
- Changing the performance period proportionally rebases its first account value to $100,000 while preserving the warm-up history required for past decisions.
- Results are not investment advice.
