import { runSimulation } from "./shared/simulation.mjs";

const I18N = {
  ko: {
    utility: "FRUIT-FLY MARKET LAB · PAPER RESEARCH ONLY", eyebrow: "PAPER RESEARCH LAB · NO REAL ORDERS",
    lede: "초파리 신경망이 오늘의 시장을 본다면.", experimentStatus: "실험 상태", paperMode: "PAPER MODE", checking: "확인 중",
    loadingTitle: "데이터를 불러오는 중입니다.", loadingCopy: "잠시만 기다려주세요.", controls: "시뮬레이션 조작",
    symbol: "종목", kpiStrategy: "KPI 전략", seed: "실험 시드", rerun: "같은 조건으로 재실행", update: "오늘 데이터 업데이트", refreshPublished: "최신 배포 데이터 확인",
    keyPerformance: "핵심 성과", maxDrawdown: "최대 낙폭", lowerDefensive: "0에 가까울수록 방어적", sharpe: "샤프 지수",
    dailyReturns: "무위험 수익률 0% 가정 · 일별 기준", todayDecision: "오늘의 뇌 투표", guideTitle: "대시보드 읽는 법",
    guideHint: "용어와 숫자의 의미", guideFlyRisk: "3일 뇌 합의·추세·변동성으로 다음 거래일 목표를 5%부터 95%까지 조절합니다. 현재 보유 비중은 가격 변동 때문에 다를 수 있습니다.",
    guidePureFly: "뇌 다수결을 다음 거래일 시가에 5%·55%·95% 비중으로 반영한 직접 신호 대조군입니다.",
    guideDrawdown: "고점에서 저점까지 계좌가 가장 크게 줄었던 비율입니다.",
    guideSharpe: "변동성 대비 일별 수익입니다. 높을수록 같은 흔들림으로 더 많은 수익을 냈다는 뜻입니다.",
    activityScore: "활성도 0–100", guideActivity: "영역별 스파이크를 로그 변환해 가장 활발한 영역을 100으로 둔 상대값입니다. 수익 확률이 아닙니다.",
    reward: "보상", guideReward: "과거 프록시에서 직전 계좌 수익을 -1~+1로 제한해 기억에 반영합니다. 최신 MaleCNS 실행에는 주입하지 않습니다.",
    replayTitle: "초파리의 판단이 포지션이 되는 순간", replayAgain: "이 장면 다시 보기", marketInput: "시장 입력", fourVotes: "네 개의 뇌 투표",
    consensus: "집단 합의", positionSizing: "10단계 비중", stockExposure: "다음 거래일 목표", nextSessionResult: "다음 장 결과", discordIndex: "집단 불화 지수",
    discordCalm: "의견이 거의 하나로 모였습니다.", discordTense: "의견이 갈리며 긴장이 높습니다.", discordDeadlock: "2대2 교착 상태입니다.",
    raceTitle: "어떤 시간 감각의 초파리가 앞서고 있나?", raceFootnote: "각 초파리의 단독 신호를 동일한 $10,000 계좌에 적용한 프록시 경기입니다.",
    rank: "위", flyNames: { 1: "정찰자", 2: "스윙어", 3: "항해자", 4: "예언자" },
    multiverseTitle: "반대로 결정했다면?", actualWorld: "이 세계 · Fly+Risk", oppositeWorld: "평행세계 · 반대 비중",
    multiverseFootnote: "선택일 다음 거래일의 시가→종가 움직임을 $2,000 종목 슬리브에 적용한 교육용 비교입니다.",
    actualWorldWins: "초파리 세계가 평행세계보다 방어했습니다.", oppositeWorldWins: "이번 하루는 반대 비중이 더 유리했습니다.", worldsTie: "두 세계의 결과가 거의 같습니다.",
    awaitingNextSession: "다음 거래일 결과를 기다리는 중", resolvedFromPrevious: "최근 결과가 나온 판단", oneDayPnl: "하루 손익", exposureWord: "비중",
    leagueKicker: "LEAGUE TABLE · COST & FX ADJUSTED", leagueTitle: "위험 조절 초파리는 기준 전략을 이겼나?",
    performanceChart: "전략별 누적 자산 비교 그래프", nextOpen: "다음 거래일 시가 체결", initialCapital: "선택 기간 시작 $10,000", allFees: "모든 전략 수수료 0.1%",
    performancePeriod: "성과 조회 기간", latestPeriodHint: "기본 최근 1년 · 업데이트 후 최신 거래일로 자동 이동", periodStart: "시작일", periodEnd: "종료일", applyPeriod: "기간 적용", periodBasis: "선택 구간을 $10,000에서 재시작", periodInvalid: "시작일은 종료일보다 빨라야 합니다.",
    fxAdjusted: "원/달러 환율 반영", holidayCarry: "휴장일 직전 평가액 유지", rollingWindows: "252거래일 창 · 63거래일 간격 점검",
    rollingLabel: "롤링 점검", profitableWindows: "수익 창", medianReturn: "중앙 수익률", worstWindowDrawdown: "최악 낙폭",
    marketView: "시장 시야", candleChart: "초파리에게 입력된 가격 캔들차트", marketSignals: "당일 감각 벡터", marketSignalsActual: "차트 요약 · 실제 MaleCNS 직접 입력값 아님", marketSignalsProxy: "프록시에 입력된 -1~+1 값", clickFlyHint: "초파리를 눌러 뇌 전환",
    play: "재생", pause: "일시정지", experimentDate: "실험 날짜", brainActivity: "뇌 영역 활성도",
    activityMicrocopy: "선택한 초파리의 당일 활성도를 대비 강화해 표시합니다. 숫자는 원래 상대값이며 수익 확률이 아닙니다.", swarmVotes: "초파리 4마리의 투표",
    brainMap: "회전 가능한 초파리 뇌 영역 지도", rotateLeft: "뇌를 왼쪽으로 회전", rotateRight: "뇌를 오른쪽으로 회전",
    dragBrain: "드래그해서 회전 · 점을 눌러 영역 확인", selectedRegion: "선택 영역", relativeActivity: "상대 활성도",
    nextExposure: "다음 거래일 목표 비중", exposureLadder: "10단계 목표 비중", exposureNote: "현금 5% 이상과 주식 5% 이상을 항상 유지합니다.", stepOf: "단계",
    recentDecisions: "최근 판단 기록", feesIncluded: "수수료·환율 포함", date: "날짜", brainVote: "뇌 투표", riskExposure: "다음 목표 비중", currentExposure: "현재 보유 비중",
    holdingsTitle: "현재 투입 자산 내역", holdingsSubtitle: "목표 비중이 아니라 선택 날짜 종가 기준의 실제 모의 보유량입니다.", bookValue: "계좌 평가액", stockValue: "주식 평가액", cashBalance: "현금", actualExposure: "현재 보유 비중", weightedNextTarget: "다음 목표 비중", holdingAsset: "종목", shares: "보유 수량", markPrice: "기준 가격", nextTargetShort: "다음 목표", holdingsFootnote: "수수료·환율 반영 모의 장부입니다. 소수점 수량을 허용하며, 목표 비중은 다음 거래일 시가에 적용됩니다.", asOf: "기준", rebalanced: "당일 조정", carried: "유지",
    close: "종가", paperOnly: "실험용 모의투자.", disclaimer: "투자 조언이나 실제 초파리 행동의 완전한 재현이 아닙니다.",
    lastUpdate: "마지막 업데이트", calculating: "시뮬레이션 계산 중…", localCalculation: "로컬 계산이 끝나면 자동으로 갱신됩니다.",
    loadFailed: "불러오기에 실패했습니다.", cachedTitle: "데모 또는 캐시 데이터로 실행 중", cachedCopy: "오늘 데이터 업데이트를 눌러 실제 일봉을 가져오세요.",
    freshTitle: "시세 데이터가 최신 상태입니다.", freshCopy: "장 마감 데이터만 사용하며 실제 주문은 실행하지 않습니다.", publishedCopy: "GitHub Actions가 만든 최신 공개 스냅샷입니다. 실제 주문은 실행하지 않습니다.",
    updating: "장 마감 데이터를 업데이트하는 중…", updateFailed: "업데이트에 실패했습니다.", cacheKept: "기존 캐시를 유지합니다.",
    actualMaleCns: "실제 MaleCNS", proxyReplay: "프록시 재생", rewardPositive: "보상", rewardNegative: "회피", marketSuffix: "시장 시야",
    viewDays: "일 시야", equitySuffix: "자산 · $10,000 기준 프록시", engineActual: "오늘의 투표는 전체 MaleCNS v1.0 그래프를 사용합니다. 과거 수익곡선은 프록시 백테스트입니다.",
    engineProxy: "과거 수익곡선은 계산용 결정론적 프록시이며 실제 MaleCNS로 표시하지 않습니다.",
    microscope: {
      title: "한 마리의 뇌 안에서 무슨 일이 일어났나?", selected: "선택한 초파리", sense: "1 · 감각 입력", rewardMemory: "2 · 보상과 기억",
      brain: "3 · 뇌 활성", decoder: "4 · 판독 경쟁", action: "5 · 최종 행동", actualMode: "실제 MaleCNS · 학습 꺼짐",
      proxyMode: "프록시 학습 루프 · 보상 작동", actualDisclosure: "실제 MaleCNS는 최근 가격을 차트 이미지로 보고 500ms 동안 발화합니다. 이 실행에서는 learning=false라 보상과 기억 갱신이 없으며, 왼쪽·오른쪽 판독 뉴런과 운동 게이트만 행동을 정합니다.",
      proxyDisclosure: "과거 재생은 6개 시장 특징 → 보상으로 조정된 기억 → 48개 프록시 상태 → 매수·매도 판독값 순서로 계산됩니다. 생물학적 MaleCNS 출력이 아닙니다.",
      featureInput: "프록시에 실제 입력된 -1~+1 값", featureContext: "실제 뇌가 본 차트의 시장 요약 · 직접 입력값 아님", rewardActive: "직전 계좌수익이 기억 가중치를 바꿈",
      rewardOff: "참고용 계좌 보상 · 실제 뇌에는 미주입", rewardValue: "보상값", memorySignal: "기억 방향", memoryStrength: "기억 세기", memoryDelta: "이번 변화",
      topRegion: "가장 활발한 영역", averageActivity: "평균 활성", actualBrain: "전체 연결망 발화", proxyBrain: "48개 상태 뉴런", buyDrive: "매수 판독", sellDrive: "매도 판독",
      rightHz: "오른쪽 DNp20 · 매수", leftHz: "왼쪽 DNp20 · 매도", gate: "운동 게이트", spikes: "스파이크", confidence: "확신도", difference: "판독 차이",
      holdProxy: "확신도가 0.17 미만이면 보유", holdActual: "게이트가 닫히거나 좌우 차이가 2Hz 미만이면 보유", directionalProxy: "더 강한 판독값이 행동을 결정", directionalActual: "오른쪽−왼쪽 발화율의 부호가 방향을 결정",
      features: ["1일 모멘텀", "5일 추세", "20일 추세", "변동성", "가격÷평균", "거래량 이상치"]
    },
    anatomy: {
      title: "판독에 관여하는 부위", sensory: "감각 입력", sensoryCopy: "시각엽이 가격 차트의 대비와 움직임을 받습니다.", integration: "중앙 통합", integrationCopy: "중앙뇌·버섯체가 감각과 내부 상태를 합칩니다.", buy: "매수 판독 · 오른쪽 DNp20", buyCopy: "오른쪽 발화율이 왼쪽보다 높으면 매수 방향입니다.", sell: "매도 판독 · 왼쪽 DNp20", sellCopy: "왼쪽 발화율이 오른쪽보다 높으면 매도 방향입니다.", gate: "운동 게이트 · DNpe017", gateCopy: "게이트가 열리고 좌우 차이가 임계값을 넘어야 행동이 출력됩니다.", proxyNote: "과거 프록시에서는 대응 기능을 단순화한 판독 노드입니다.", actualNote: "실제 MaleCNS 주석 뉴런의 당일 발화를 사용합니다."
    },
    behavior: {
      title: "초파리 행동이 투자 신호로 번역되는 과정", subtitle: "접근·회피, 좌·우 회전, 매수·매도는 서로 다른 층입니다.", rewardCase: "설탕 보상 사례", aversiveCase: "불쾌 자극 사례", replay: "다시 재생",
      rewardSteps: ["레몬 냄새", "설탕 제공", "보상 도파민", "기억 연결 강화", "냄새 재노출", "접근 행동"],
      rewardDetails: ["감각 단서 A", "좋은 결과", "강화 신호", "버섯체 가소성", "같은 단서", "단서 쪽으로 이동"],
      aversiveSteps: ["민트 냄새", "쓴맛·열", "회피 도파민", "기억 연결 변화", "냄새 재노출", "회피 행동"],
      aversiveDetails: ["감각 단서 B", "불쾌한 결과", "회피 신호", "버섯체 가소성", "같은 단서", "단서에서 멀어짐"],
      rewardLesson: "실제 파리는 ‘레몬 냄새와 설탕이 함께 왔다’를 학습해 같은 냄새에 접근할 수 있습니다. 과거 프록시에서는 수익을 이 보상에 비유합니다.",
      aversiveLesson: "실제 파리는 냄새와 쓴맛·열 같은 불쾌 자극을 연합해 회피할 수 있습니다. 파리약은 독성이므로 학습 자극의 좋은 비유가 아닙니다.",
      axisTitle: "세 개의 서로 다른 행동 축", humanChoice: "마지막 줄만 사람이 정한 라벨", motivationAxis: "동기 축", avoidance: "회피", approach: "접근", motorAxis: "운동 방향 축", leftTurn: "왼쪽 회전", rightTurn: "오른쪽 회전", notSame: "접근·회피 ≠ 좌·우 회전", humanMapping: "사람이 BCI 라벨을 부여", marketAxis: "시장 행동 라벨", buy: "매수", sell: "매도",
      flip: "매핑 뒤집어보기", restore: "원래 매핑 복원", currentRule: "현재 규칙: 오른쪽 우세=매수 · 왼쪽 우세=매도", flippedRule: "가상 규칙: 오른쪽 우세=매도 · 왼쪽 우세=매수", previewOnly: "교육용 미리보기이며 실제 전략은 바뀌지 않습니다.",
      actualReadout: "선택한 실제 MaleCNS 판독", proxyReadout: "과거 프록시 판독 · DNp20 발화율 없음", rightNeuron: "오른쪽 DNp20", leftNeuron: "왼쪽 DNp20", gate: "DNpe017 게이트", result: "현재 결과",
      actualDisclosure: "MaleCNS의 좌·우 출력은 원래 방향성 운동 신호입니다. 매수·매도 의미는 없으며, 이 대시보드가 오른쪽을 매수·왼쪽을 매도로 임의 지정했습니다.",
      proxyDisclosure: "과거 프록시는 생물학적 좌·우 뉴런 대신 별도의 매수·매도 판독값을 사용합니다. 접근·회피 설명은 보상 학습을 이해하기 위한 비유입니다."
    },
    actions: { BUY: "매수", HOLD: "보유", SELL: "매도" },
    labels: { flyRisk: "Fly+Risk", fly: "Fly Signal", shuffled: "무작위 신경망", buyHold: "Buy & Hold", sma: "이동평균", random: "랜덤" },
    help: {
      equity: "선택한 전략의 다섯 종목 합산 평가액입니다. 시작금액은 10,000달러입니다.",
      drawdown: "이전 최고 평가액에서 이후 최저 평가액까지의 최대 하락률입니다.",
      sharpe: "일별 평균수익을 일별 변동성으로 나눈 뒤 연율화했습니다. 무위험 수익률은 0%로 가정합니다.",
      decision: "네 초파리의 매수·보유·매도 다수결입니다. 동률이면 보유이며 Fly+Risk의 실제 투자 비중과는 다를 수 있습니다.",
      activity: "스파이크 수를 로그 변환하고 같은 초파리에서 가장 활발한 영역을 100으로 정규화한 상대값입니다.",
      neuralActual: "오늘의 값은 공식 MaleCNS v1.0 전체 연결망을 C++ 커널로 계산했습니다.",
      neuralProxy: "선택한 과거 날짜는 빠른 재생을 위한 프록시 신경망 값입니다.",
      reward: "과거 프록시에서는 직전 일일 계좌수익을 -1~+1로 압축해 기억에 반영합니다. 최신 MaleCNS에는 참고값일 뿐 주입되지 않습니다."
    },
    regions: {
      "시각 감각": ["시각 감각", "가격 이미지를 처음 받아들이는 시각 감각 뉴런군입니다."],
      "시각엽 내부": ["시각엽 내부", "시각엽 안에서 패턴과 대비를 내부 처리하는 뉴런군입니다."],
      "시각 투사": ["시각 투사", "시각엽의 정보를 중앙뇌 쪽으로 전달하거나 되돌리는 경로입니다."],
      "중앙뇌 내부": ["중앙뇌 내부", "여러 입력과 내부 상태가 통합되는 중앙뇌 내부 뉴런군입니다."],
      "중앙뇌 감각": ["중앙뇌 감각", "중앙뇌에 직접 감각 정보를 전달하는 뉴런군입니다."],
      "상행뉴런": ["상행뉴런", "몸 쪽에서 뇌 방향으로 신호를 올리는 경로입니다."],
      "하행뉴런": ["하행뉴런", "뇌의 결정을 운동계 쪽으로 내보내는 경로입니다."],
      "운동뉴런": ["운동뉴런", "행동 출력과 연결된 운동 관련 뉴런군입니다."],
      "시각엽": ["시각엽", "프록시에서 가격 변화와 캔들 패턴을 처음 처리하는 시각 입력 영역입니다."],
      "버섯체": ["버섯체", "기억과 보상 연관을 단순화해 나타내는 프록시 영역입니다."],
      "중심복합체": ["중심복합체", "방향 선택과 행동 결정을 통합하는 역할을 흉내 낸 프록시 영역입니다."],
      "후각엽": ["후각엽", "실제 후각 회로에 대응하지만 여기서는 보조 감각 채널로만 사용됩니다."],
      "측각": ["측각", "감각 신호와 타고난 반응의 결합을 흉내 낸 프록시 영역입니다."],
      "상부중앙뇌": ["상부중앙뇌", "여러 입력을 통합하는 상부 중앙뇌 프록시 영역입니다."],
      "하부중앙뇌": ["하부중앙뇌", "결정 신호를 하위 회로로 전달하는 프록시 영역입니다."],
      "식도하부": ["식도하부", "보상과 운동 입력을 연결하는 기능을 단순화한 프록시 영역입니다."],
      "운동게이트": ["운동게이트", "판독 신호가 행동 출력으로 넘어갈지를 나타내는 프록시 게이트입니다."],
      "보상회로": ["보상회로", "직전 수익 피드백을 기억에 반영하는 프록시 회로입니다."],
      "회피회로": ["회피회로", "손실 피드백에 대한 회피 반응을 흉내 낸 프록시 회로입니다."]
    }
  },
  en: {
    utility: "FRUIT-FLY MARKET LAB · PAPER RESEARCH ONLY", eyebrow: "PAPER RESEARCH LAB · NO REAL ORDERS",
    lede: "What if a fruit-fly connectome watched today's market?", experimentStatus: "Experiment status", paperMode: "PAPER MODE", checking: "Checking",
    loadingTitle: "Loading data.", loadingCopy: "This should only take a moment.", controls: "Simulation controls",
    symbol: "Asset", kpiStrategy: "KPI strategy", seed: "Experiment seed", rerun: "Rerun same setup", update: "Update daily data", refreshPublished: "Check published data",
    keyPerformance: "Key performance", maxDrawdown: "Maximum drawdown", lowerDefensive: "Closer to zero means more defensive", sharpe: "Sharpe ratio",
    dailyReturns: "0% risk-free rate · daily returns", todayDecision: "Today's brain vote", guideTitle: "How to read this dashboard",
    guideHint: "Definitions for the numbers and terms", guideFlyRisk: "Uses three-day brain consensus, trend and volatility to set the next-session target from 5% to 95%. Current exposure can drift with price.",
    guidePureFly: "A direct-signal control mapping the brain majority to 5%, 55% or 95% exposure at the next market open.",
    guideDrawdown: "The largest peak-to-trough percentage decline in account value.",
    guideSharpe: "Daily return relative to volatility. Higher means more return for the same amount of movement.",
    activityScore: "Activity 0–100", guideActivity: "A relative score: region spikes are log-scaled and the most active region is set to 100. It is not a return probability.",
    reward: "Reward", guideReward: "Historical proxy memory uses the prior account return clipped to -1…+1. It is not injected into the latest MaleCNS run.",
    replayTitle: "The moment a fly-brain vote becomes a position", replayAgain: "Replay this decision", marketInput: "Market input", fourVotes: "Four brain votes",
    consensus: "Swarm consensus", positionSizing: "Ten-step exposure", stockExposure: "Next-session target", nextSessionResult: "Next-session result", discordIndex: "Swarm disagreement",
    discordCalm: "The swarm is nearly unanimous.", discordTense: "Split opinions are raising the tension.", discordDeadlock: "The swarm is locked 2–2.",
    raceTitle: "Which time-horizon fly is leading?", raceFootnote: "A proxy race applying each fly's solo signal to the same $10,000 account.",
    rank: "#", flyNames: { 1: "Scout", 2: "Swinger", 3: "Navigator", 4: "Oracle" },
    multiverseTitle: "What if it chose the opposite?", actualWorld: "This world · Fly+Risk", oppositeWorld: "Parallel world · opposite exposure",
    multiverseFootnote: "An educational comparison applying the selected decision to a $2,000 sleeve over the next session's open-to-close move.",
    actualWorldWins: "The fly world defended better than the parallel world.", oppositeWorldWins: "The opposite exposure won this single day.", worldsTie: "The two worlds finished almost level.",
    awaitingNextSession: "Waiting for the next session", resolvedFromPrevious: "Latest resolved decision", oneDayPnl: "one-day P&L", exposureWord: "exposure",
    leagueKicker: "LEAGUE TABLE · COST & FX ADJUSTED", leagueTitle: "Did risk-managed flies beat the benchmarks?",
    performanceChart: "Cumulative account value by strategy", nextOpen: "Trades at next market open", initialCapital: "Selected period starts at $10,000", allFees: "0.1% fee on every strategy",
    performancePeriod: "Performance period", latestPeriodHint: "Defaults to the latest year · moves to the newest session after update", periodStart: "Start", periodEnd: "End", applyPeriod: "Apply period", periodBasis: "Selected range rebased to $10,000", periodInvalid: "The start date must be earlier than the end date.",
    fxAdjusted: "USD/KRW FX adjusted", holidayCarry: "Last value carried across holidays", rollingWindows: "252-session windows · checked every 63 sessions",
    rollingLabel: "Rolling check", profitableWindows: "profitable windows", medianReturn: "median return", worstWindowDrawdown: "worst drawdown",
    marketView: "Market view", candleChart: "Price candlesticks shown to the fly", marketSignals: "Daily sensory vector", marketSignalsActual: "Chart summary · not direct MaleCNS inputs", marketSignalsProxy: "Actual -1…+1 proxy inputs", clickFlyHint: "Select a fly to switch brains",
    play: "Play", pause: "Pause", experimentDate: "Experiment date", brainActivity: "Brain-region activity",
    activityMicrocopy: "Contrast-enhanced activity for the selected fly and date. Labels retain the original relative score; they are not return probabilities.", swarmVotes: "Votes from four flies",
    brainMap: "Rotatable fruit-fly brain-region map", rotateLeft: "Rotate brain left", rotateRight: "Rotate brain right",
    dragBrain: "Drag to rotate · select a point to inspect a region", selectedRegion: "Selected region", relativeActivity: "Relative activity",
    nextExposure: "Next-session target exposure", exposureLadder: "Ten target-exposure levels", exposureNote: "Always keeps at least 5% cash and 5% stock exposure.", stepOf: "step",
    recentDecisions: "Recent decision trail", feesIncluded: "Fees & FX included", date: "Date", brainVote: "Brain vote", riskExposure: "Next target", currentExposure: "Current exposure",
    holdingsTitle: "Currently deployed assets", holdingsSubtitle: "Actual paper holdings marked at the selected close—not target weights.", bookValue: "Account value", stockValue: "Stock value", cashBalance: "Cash", actualExposure: "Current exposure", weightedNextTarget: "Next target", holdingAsset: "Asset", shares: "Shares held", markPrice: "Mark price", nextTargetShort: "Next target", holdingsFootnote: "Paper ledger with fees and FX included. Fractional shares are allowed; target exposure is applied at the next market open.", asOf: "as of", rebalanced: "adjusted today", carried: "carried",
    close: "Close", paperOnly: "Paper-trading experiment.", disclaimer: "Not investment advice or a complete reproduction of fruit-fly behavior.",
    lastUpdate: "Last update", calculating: "Running simulation…", localCalculation: "The dashboard refreshes when local computation finishes.",
    loadFailed: "Could not load the dashboard.", cachedTitle: "Running on demo or cached data", cachedCopy: "Use Update daily data to fetch the latest daily bars.",
    freshTitle: "Market data is current.", freshCopy: "Only end-of-day data is used. No real orders are sent.", publishedCopy: "This is the latest public snapshot produced by GitHub Actions. No real orders are sent.",
    updating: "Updating end-of-day market data…", updateFailed: "Update failed.", cacheKept: "The existing cache was kept.",
    actualMaleCns: "Actual MaleCNS", proxyReplay: "Proxy replay", rewardPositive: "Reward", rewardNegative: "Avoidance", marketSuffix: "market view",
    viewDays: "day view", equitySuffix: "account · $10,000 proxy", engineActual: "Today's votes use the full MaleCNS v1.0 graph. Historical equity curves remain proxy backtests.",
    engineProxy: "Historical curves use a deterministic compute proxy and are not presented as actual MaleCNS output.",
    microscope: {
      title: "What happened inside one fly brain?", selected: "Selected fly", sense: "1 · Sensory input", rewardMemory: "2 · Reward & memory",
      brain: "3 · Brain activity", decoder: "4 · Decoder duel", action: "5 · Final action", actualMode: "Actual MaleCNS · learning off",
      proxyMode: "Proxy learning loop · reward active", actualDisclosure: "Actual MaleCNS sees recent prices as a chart image and spikes for 500ms. This run uses learning=false, so no reward or memory update is injected; left/right decoder neurons and the motor gate determine the action.",
      proxyDisclosure: "Historical replay computes six market features → reward-adjusted memory → 48 proxy states → buy/sell readouts. It is not biological MaleCNS output.",
      featureInput: "Actual -1…+1 inputs to the proxy", featureContext: "Market summary of the chart seen by the actual brain · not direct inputs", rewardActive: "Prior account return changes memory weights",
      rewardOff: "Context-only account reward · not injected into the actual brain", rewardValue: "Reward", memorySignal: "Memory direction", memoryStrength: "Memory strength", memoryDelta: "Change now",
      topRegion: "Most active region", averageActivity: "Mean activity", actualBrain: "Full-connectome spikes", proxyBrain: "48 state neurons", buyDrive: "BUY readout", sellDrive: "SELL readout",
      rightHz: "Right DNp20 · BUY", leftHz: "Left DNp20 · SELL", gate: "Motor gate", spikes: "spikes", confidence: "Confidence", difference: "Readout gap",
      holdProxy: "HOLD when confidence is below 0.17", holdActual: "HOLD when the gate is closed or the left/right gap is under 2Hz", directionalProxy: "The stronger readout determines the action", directionalActual: "The sign of right-minus-left firing rate sets direction",
      features: ["1-day momentum", "5-day trend", "20-day trend", "Volatility", "Price ÷ average", "Volume anomaly"]
    },
    anatomy: {
      title: "Regions involved in readout", sensory: "Sensory input", sensoryCopy: "The optic lobe receives chart contrast and movement.", integration: "Central integration", integrationCopy: "Central-brain and mushroom-body circuits combine sensation with internal state.", buy: "BUY readout · right DNp20", buyCopy: "A higher right-side rate points toward BUY.", sell: "SELL readout · left DNp20", sellCopy: "A higher left-side rate points toward SELL.", gate: "Motor gate · DNpe017", gateCopy: "An action passes only when the gate opens and the side gap clears threshold.", proxyNote: "Historical proxy dates use simplified functional readout nodes.", actualNote: "The latest run uses daily spikes from annotated MaleCNS neurons."
    },
    behavior: {
      title: "How fly behavior becomes a market signal", subtitle: "Approach/avoidance, left/right turning and BUY/SELL are separate layers.", rewardCase: "Sugar reward case", aversiveCase: "Aversive case", replay: "Replay",
      rewardSteps: ["Lemon odor", "Sugar arrives", "Reward dopamine", "Memory strengthens", "Odor returns", "Approach"],
      rewardDetails: ["Sensory cue A", "Good outcome", "Reinforcement", "Mushroom-body plasticity", "Same cue", "Move toward cue"],
      aversiveSteps: ["Mint odor", "Bitter·heat", "Aversive dopamine", "Memory changes", "Odor returns", "Avoidance"],
      aversiveDetails: ["Sensory cue B", "Bad outcome", "Avoidance signal", "Mushroom-body plasticity", "Same cue", "Move away"],
      rewardLesson: "A real fly can learn that lemon odor predicts sugar and later approach the same odor. Historical proxy profit is analogous to this reward.",
      aversiveLesson: "A real fly can associate an odor with bitter taste or heat and later avoid it. Insecticide is toxic, so it is not a clean learning analogy.",
      axisTitle: "Three different behavioral axes", humanChoice: "Only the last row is a human-assigned label", motivationAxis: "Motivation axis", avoidance: "Avoid", approach: "Approach", motorAxis: "Motor-direction axis", leftTurn: "Turn left", rightTurn: "Turn right", notSame: "Approach/avoidance ≠ left/right turning", humanMapping: "Human assigns BCI labels", marketAxis: "Market-action label", buy: "BUY", sell: "SELL",
      flip: "Flip mapping", restore: "Restore mapping", currentRule: "Current rule: right dominance=BUY · left dominance=SELL", flippedRule: "Hypothetical: right dominance=SELL · left dominance=BUY", previewOnly: "Educational preview only; the strategy is unchanged.",
      actualReadout: "Selected actual MaleCNS readout", proxyReadout: "Historical proxy readout · no DNp20 firing rates", rightNeuron: "Right DNp20", leftNeuron: "Left DNp20", gate: "DNpe017 gate", result: "Current result",
      actualDisclosure: "MaleCNS left/right outputs are directional motor signals, not financial meanings. This dashboard arbitrarily maps right to BUY and left to SELL.",
      proxyDisclosure: "Historical proxy dates use separate BUY/SELL readouts instead of biological left/right neurons. Approach/avoidance is an analogy for understanding reinforcement."
    },
    actions: { BUY: "BUY", HOLD: "HOLD", SELL: "SELL" },
    labels: { flyRisk: "Fly+Risk", fly: "Fly Signal", shuffled: "Shuffled network", buyHold: "Buy & Hold", sma: "Moving average", random: "Random" },
    help: {
      equity: "Combined account value across the five assets. Starting capital is $10,000.",
      drawdown: "The largest decline from a previous account-value peak to a later trough.",
      sharpe: "Annualized daily mean return divided by daily volatility, assuming a 0% risk-free rate.",
      decision: "The majority BUY, HOLD or SELL vote from four flies; a tie is HOLD. It can differ from the Fly+Risk exposure.",
      activity: "A relative score from log-scaled spike counts, normalized so the most active region in the same fly equals 100.",
      neuralActual: "Today's value was computed on the full official MaleCNS v1.0 connectome with the C++ kernel.",
      neuralProxy: "Past dates use proxy-network activity for fast replay.",
      reward: "Historical proxy memory uses the prior daily account return clipped to -1…+1. On the latest MaleCNS run it is context only, not an injected signal."
    },
    regions: {
      "시각 감각": ["Visual sensory", "Neurons that first receive the encoded market image."],
      "시각엽 내부": ["Optic-lobe intrinsic", "Neurons processing patterns and contrast inside the optic lobe."],
      "시각 투사": ["Visual projection", "Paths carrying information between the optic lobe and central brain."],
      "중앙뇌 내부": ["Central-brain intrinsic", "Neurons integrating sensory input and internal state in the central brain."],
      "중앙뇌 감각": ["Central-brain sensory", "Neurons bringing sensory information directly into the central brain."],
      "상행뉴런": ["Ascending neurons", "Paths carrying signals from the body toward the brain."],
      "하행뉴런": ["Descending neurons", "Paths carrying brain output toward the motor system."],
      "운동뉴런": ["Motor neurons", "Motor-related neurons associated with behavioral output."],
      "시각엽": ["Optic lobe", "The proxy region that first processes price movement and candle patterns."],
      "버섯체": ["Mushroom body", "A proxy region representing simplified memory and reward association."],
      "중심복합체": ["Central complex", "A proxy region integrating direction selection and behavioral decisions."],
      "후각엽": ["Antennal lobe", "The biological region is olfactory; here it is used only as an auxiliary proxy channel."],
      "측각": ["Lateral horn", "A proxy for combining sensory signals with innate responses."],
      "상부중앙뇌": ["Superior central brain", "A proxy region integrating multiple inputs in the upper central brain."],
      "하부중앙뇌": ["Inferior central brain", "A proxy region relaying decision signals toward lower circuits."],
      "식도하부": ["Subesophageal zone", "A simplified proxy linking reward and motor inputs."],
      "운동게이트": ["Motor gate", "A proxy gate indicating whether decoder activity passes to behavioral output."],
      "보상회로": ["Reward circuit", "A proxy circuit applying prior profit feedback to memory."],
      "회피회로": ["Avoidance circuit", "A proxy circuit modeling avoidance responses to loss feedback."]
    }
  }
};

const state = {
  data: null,
  symbol: "NVDA",
  strategy: "flyRisk",
  index: 0,
  timer: null,
  brainRotation: -12,
  selectedRegion: 0,
  selectedFly: 0,
  rangeStart: null,
  rangeEnd: null,
  rangePreset: "1Y",
  behaviorScenario: "reward",
  mappingFlipped: false,
  staticMode: false,
  staticSource: null,
  locale: localStorage.getItem("flyfund-locale") === "en" ? "en" : "ko",
  colors: { flyRisk: "#baf36b", fly: "#54e6aa", shuffled: "#b99aff", buyHold: "#67d8ef", sma: "#ffcb69", random: "#ff7b86" }
};

const BRAIN_POINTS = [
  { x: -105, y: -38, z: 44, color: "#67d8ef" },
  { x: -72, y: -58, z: 66, color: "#8eecc7" },
  { x: -42, y: -18, z: 78, color: "#baf36b" },
  { x: 2, y: -24, z: 88, color: "#ffcb69" },
  { x: 33, y: -57, z: 56, color: "#b99aff" },
  { x: -18, y: 20, z: 82, color: "#54e6aa" },
  { x: 48, y: 18, z: 72, color: "#ff9f7e" },
  { x: 82, y: 37, z: 46, color: "#ff7b86" },
  { x: -54, y: 49, z: 69, color: "#67d8ef" },
  { x: 4, y: 63, z: 82, color: "#ffcb69" },
  { x: -25, y: 4, z: 102, color: "#baf36b" },
  { x: 27, y: 5, z: 101, color: "#ff7b86" }
];

const EXPOSURE_LEVELS = Array.from({ length: 10 }, (_, index) => index * 10 + 5);
const PERFORMANCE_KEYS = ["flyRisk", "fly", "buyHold", "sma"];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const t = (key) => key.split(".").reduce((value, part) => value?.[part], I18N[state.locale]) ?? key;
const svgNS = "http://www.w3.org/2000/svg";

function svg(tag, attrs = {}) {
  const element = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function money(value) {
  return new Intl.NumberFormat(state.locale === "ko" ? "ko-KR" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function localPrice(value, symbol = state.symbol) {
  const currency = symbol === "000660.KS" ? "KRW" : "USD";
  return new Intl.NumberFormat(state.locale === "ko" ? "ko-KR" : "en-US", { style: "currency", currency, maximumFractionDigits: currency === "KRW" ? 0 : 2 }).format(value);
}

function percent(value, digits = 1) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

function moneySigned(value) {
  const absolute = new Intl.NumberFormat(state.locale === "ko" ? "ko-KR" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(value));
  return `${value >= 0 ? "+" : "−"}${absolute}`;
}

function actionLabel(action) {
  return t(`actions.${action}`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function applyLocale() {
  document.documentElement.lang = state.locale;
  document.title = state.locale === "ko" ? "FlyFund Arena · 초파리 모의펀드" : "FlyFund Arena · Connectome Paper Fund";
  $$('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAria)); });
  $$('[data-locale]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.locale === state.locale)));
  $$('[data-help]').forEach((button) => {
    const copy = t(`help.${button.dataset.help}`);
    button.dataset.tooltip = copy;
    button.setAttribute("aria-label", copy);
  });
  if (state.data) renderAll();
}

async function loadDashboard() {
  const forceStaticRefresh = arguments[0] === true;
  const seed = Number($("#seed-input").value || 42);
  setBusy(true, t("calculating"));
  try {
    if (state.staticMode) {
      state.data = await loadStaticDashboard(seed, forceStaticRefresh);
    } else {
      try {
        const response = await fetch(`/api/dashboard?seed=${encodeURIComponent(seed)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        state.data = await response.json();
      } catch {
        state.staticMode = true;
        state.data = await loadStaticDashboard(seed, true);
      }
    }
    populateSymbols();
    initializePeriod();
    updateTimelineBounds(true);
    renderAll();
  } catch (error) {
    showNotice(t("loadFailed"), error.message, "warn");
  } finally {
    setBusy(false);
  }
}

function applyMaleCnsSnapshot(simulation, actual) {
  if (!actual?.engine?.actualConnectome) return simulation;
  for (const [symbol, decision] of Object.entries(actual.decisions || {})) {
    const trace = simulation.sleeves?.[symbol]?.trace;
    if (!trace?.length) continue;
    const target = trace.findLast((point) => point.date === decision.date) || trace.at(-1);
    target.action = decision.action;
    target.votes = decision.votes;
    target.engine = actual.engine.id;
  }
  return {
    ...simulation,
    engine: actual.engine,
    actualDecisionGeneratedAt: actual.generatedAt,
    neuralComputeSeconds: actual.totalComputeSeconds
  };
}

async function loadStaticDashboard(seed, refresh = false) {
  if (!state.staticSource || refresh) {
    const cacheBust = refresh ? `?v=${Date.now()}` : "";
    const [marketResponse, neuralResponse] = await Promise.all([
      fetch(`./data/market-cache.json${cacheBust}`, { cache: refresh ? "no-store" : "default" }),
      fetch(`./data/malecns-latest.json${cacheBust}`, { cache: refresh ? "no-store" : "default" })
    ]);
    if (!marketResponse.ok) throw new Error(`Static market HTTP ${marketResponse.status}`);
    state.staticSource = {
      market: await marketResponse.json(),
      neural: neuralResponse.ok ? await neuralResponse.json() : null
    };
  }
  return applyMaleCnsSnapshot(runSimulation(state.staticSource.market, seed), state.staticSource.neural);
}

function setBusy(busy, label = "") {
  $("#rerun-button").disabled = busy;
  $("#update-button").disabled = busy;
  if (busy) showNotice(label, t("localCalculation"), "ok");
}

function showNotice(title, copy, variant) {
  const notice = $("#notice");
  notice.className = `notice ${variant || ""}`;
  $("#notice-title").textContent = title;
  $("#notice-copy").textContent = copy || "";
}

function populateSymbols() {
  const select = $("#symbol-select");
  select.innerHTML = state.data.symbols.map((item) =>
    `<option value="${escapeHtml(item.symbol)}">${escapeHtml(item.name)} · ${escapeHtml(item.symbol)}</option>`
  ).join("");
  if (!state.data.sleeves[state.symbol]) state.symbol = state.data.symbols[0].symbol;
  select.value = state.symbol;
}

function currentTrace() {
  return state.data?.sleeves?.[state.symbol]?.trace || [];
}

function currentPoint() {
  return currentTrace()[state.index] || null;
}

function initializePeriod() {
  const curve = state.data?.curves?.flyRisk || [];
  const earliest = curve[0]?.date || null;
  const latest = curve.at(-1)?.date || null;
  state.rangeStart = latest ? (shiftedStart(latest, 1) < earliest ? earliest : shiftedStart(latest, 1)) : earliest;
  state.rangeEnd = latest;
  state.rangePreset = "1Y";
  for (const selector of ["#period-start", "#period-end"]) {
    const input = $(selector);
    input.min = earliest || "";
    input.max = latest || "";
  }
}

function updateTimelineBounds(selectEnd = false) {
  const trace = currentTrace();
  if (!trace.length) return;
  let startIndex = trace.findIndex((point) => point.date >= state.rangeStart);
  if (startIndex < 0) startIndex = 0;
  let endIndex = trace.findLastIndex((point) => point.date <= state.rangeEnd);
  if (endIndex < startIndex) endIndex = trace.length - 1;
  $("#time-slider").min = startIndex;
  $("#time-slider").max = endIndex;
  state.index = selectEnd ? endIndex : Math.max(startIndex, Math.min(endIndex, state.index));
  $("#time-slider").value = state.index;
}

function shiftedStart(endDate, years) {
  const date = new Date(`${endDate}T00:00:00Z`);
  date.setUTCFullYear(date.getUTCFullYear() - years);
  return date.toISOString().slice(0, 10);
}

function setPerformancePeriod(start, end, preset = "CUSTOM") {
  const curve = state.data.curves.flyRisk;
  const earliest = curve[0].date;
  const latest = curve.at(-1).date;
  const boundedStart = start < earliest ? earliest : start > latest ? latest : start;
  const boundedEnd = end > latest ? latest : end < earliest ? earliest : end;
  if (boundedStart > boundedEnd) {
    showNotice(t("periodInvalid"), `${boundedStart} → ${boundedEnd}`, "warn");
    return;
  }
  state.rangeStart = boundedStart;
  state.rangeEnd = boundedEnd;
  state.rangePreset = preset;
  updateTimelineBounds(true);
  renderAll();
}

function rebasedCurve(points) {
  const selected = points.filter((point) => point.date >= state.rangeStart && point.date <= state.rangeEnd);
  if (!selected.length) return [];
  const baseline = selected[0].value || state.data.settings.initialCash;
  return selected.map((point) => ({ ...point, value: point.value / baseline * state.data.settings.initialCash }));
}

function performanceCurves() {
  return Object.fromEntries(PERFORMANCE_KEYS.map((key) => [key, rebasedCurve(state.data.curves[key])]));
}

function curveMetric(curve) {
  const values = curve.map((point) => point.value);
  if (!values.length) return { value: state.data.settings.initialCash, returnPct: 0, maxDrawdownPct: 0, sharpe: 0 };
  const returns = values.slice(1).map((value, index) => value / values[index] - 1);
  const average = mean(returns);
  const variance = returns.reduce((sum, value) => sum + (value - average) ** 2, 0) / Math.max(1, returns.length - 1);
  let peak = values[0];
  let worst = 0;
  values.forEach((value) => { peak = Math.max(peak, value); worst = Math.min(worst, value / peak - 1); });
  return {
    value: values.at(-1),
    returnPct: (values.at(-1) / state.data.settings.initialCash - 1) * 100,
    maxDrawdownPct: worst * 100,
    sharpe: variance ? average / Math.sqrt(variance) * Math.sqrt(252) : 0
  };
}

function renderAll() {
  const { data } = state;
  const period = performanceCurves();
  const metric = curveMetric(period[state.strategy]);
  const strategyName = t(`labels.${state.strategy}`);
  $("#engine-status").textContent = `ENGINE · ${data.engine.label.toUpperCase()}`;
  $("#engine-note").textContent = data.engine.actualConnectome ? t("engineActual") : t("engineProxy");
  $("#last-update").textContent = `${t("lastUpdate")} · ${new Date(data.market.generatedAt).toLocaleString(state.locale === "ko" ? "ko-KR" : "en-US")}`;
  $("#update-button").textContent = t(state.staticMode ? "refreshPublished" : "update");
  $("#equity-label").textContent = `${strategyName} ${t("equitySuffix")}`;
  $("#equity-stat").textContent = money(metric.value);
  $("#return-stat").textContent = `${percent(metric.returnPct)} · ${state.rangeStart} → ${state.rangeEnd}`;
  $("#return-stat").className = metric.returnPct >= 0 ? "positive" : "negative";
  $("#drawdown-stat").textContent = `${metric.maxDrawdownPct.toFixed(1)}%`;
  $("#sharpe-stat").textContent = metric.sharpe.toFixed(2);
  if (data.market.stale) showNotice(t("cachedTitle"), data.market.warning || t("cachedCopy"), "warn");
  else showNotice(t("freshTitle"), t(state.staticMode ? "publishedCopy" : "freshCopy"), "ok");
  renderPerformance(period);
  renderSelected();
}

function renderPerformance(period = performanceCurves()) {
  const chart = $("#performance-chart");
  chart.replaceChildren();
  const width = Math.max(620, chart.clientWidth || 900);
  const height = 290;
  const margin = { top: 12, right: 12, bottom: 28, left: 54 };
  chart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const entries = PERFORMANCE_KEYS.map((key) => [key, period[key]]).filter(([, points]) => points.length);
  const all = entries.flatMap(([, points]) => points.map((point) => point.value));
  const min = Math.min(...all) * 0.97;
  const max = Math.max(...all) * 1.03;
  const firstDate = entries[0]?.[1]?.[0]?.date || state.rangeStart;
  const lastDate = entries[0]?.[1]?.at(-1)?.date || state.rangeEnd;
  const firstTime = new Date(`${firstDate}T00:00:00Z`).getTime();
  const lastTime = new Date(`${lastDate}T00:00:00Z`).getTime();
  const x = (date) => margin.left + (new Date(`${date}T00:00:00Z`).getTime() - firstTime) / Math.max(1, lastTime - firstTime) * (width - margin.left - margin.right);
  const y = (value) => margin.top + (max - value) / Math.max(1, max - min) * (height - margin.top - margin.bottom);
  for (let index = 0; index <= 4; index++) {
    const value = min + (max - min) * index / 4;
    const yy = y(value);
    chart.append(svg("line", { x1: margin.left, y1: yy, x2: width - margin.right, y2: yy, class: "grid" }));
    const label = svg("text", { x: margin.left - 8, y: yy + 3, "text-anchor": "end" });
    label.textContent = `$${Math.round(value / 1000)}k`;
    chart.append(label);
  }
  entries.forEach(([key, points]) => {
    const d = points.map((point, index) => `${index ? "L" : "M"}${x(point.date).toFixed(2)},${y(point.value).toFixed(2)}`).join(" ");
    chart.append(svg("path", { d, class: `line ${key}`, stroke: state.colors[key] }));
  });
  [[firstDate, margin.left], [lastDate, width - margin.right]].forEach(([labelText, xx], index) => {
    const label = svg("text", { x: xx, y: height - 7, "text-anchor": index ? "end" : "start" });
    label.textContent = labelText || "";
    chart.append(label);
  });
  $("#performance-legend").innerHTML = entries.map(([key]) =>
    `<span class="legend-item ${key === state.strategy ? "selected" : ""}" style="--color:${state.colors[key]}"><i></i>${escapeHtml(t(`labels.${key}`))} ${percent(curveMetric(period[key]).returnPct)}</span>`
  ).join("");
  const selectedMetric = curveMetric(period[state.strategy]);
  $("#validation-strip").innerHTML = `<span><strong>${escapeHtml(t("periodBasis"))}</strong></span><span>${firstDate} → ${lastDate}</span><span>${escapeHtml(t(`labels.${state.strategy}`))} <b>${percent(selectedMetric.returnPct)}</b></span><span>${escapeHtml(t("maxDrawdown"))} <b>${selectedMetric.maxDrawdownPct.toFixed(1)}%</b></span>`;
  $("#period-start").value = state.rangeStart;
  $("#period-end").value = state.rangeEnd;
  $("#period-latest").textContent = `LATEST · ${state.data.curves.flyRisk.at(-1)?.date || "—"}`;
  $("#period-basis").textContent = `${t("periodBasis")} · ${firstDate} → ${lastDate}`;
  $$("#period-presets [data-period]").forEach((button) => button.classList.toggle("active", button.dataset.period === state.rangePreset));
}

function renderSelected() {
  const point = currentPoint();
  if (!point) return;
  const meta = state.data.symbols.find((item) => item.symbol === state.symbol);
  $("#market-title").textContent = `${meta.name} ${t("marketSuffix")}`;
  $("#price-readout").textContent = localPrice(point.rawClose ?? point.close);
  $("#date-readout").textContent = point.date;
  $("#timeline-label").textContent = point.date;
  $("#reward-badge").textContent = `${point.reward >= 0 ? t("rewardPositive") : t("rewardNegative")} ${point.reward.toFixed(2)}`;
  $("#reward-badge").className = `mini-badge tooltip-trigger ${point.reward < 0 ? "negative" : "positive"}`;
  $("#reward-badge").dataset.tooltip = t("help.reward");
  $("#reward-badge").setAttribute("aria-label", t("help.reward"));
  $("#neural-source").textContent = point.engine ? t("actualMaleCns") : t("proxyReplay");
  $("#neural-source").className = `mini-badge tooltip-trigger ${point.engine ? "positive" : ""}`;
  $("#neural-source").dataset.tooltip = point.engine ? t("help.neuralActual") : t("help.neuralProxy");
  $("#neural-source").setAttribute("aria-label", $("#neural-source").dataset.tooltip);
  $("#action-stat").textContent = actionLabel(point.action);
  $("#vote-stat").textContent = point.votes.map((vote) => `#${vote.fly} ${actionLabel(vote.action)}`).join(" · ");
  renderCandles();
  renderMarketSignals(point);
  renderBrain(point);
  renderVotes(point.votes);
  renderTable();
  const bookDate = state.index === Number($("#time-slider").max) ? state.rangeEnd : point.date;
  renderHoldings(bookDate);
  renderReplay(point);
  renderBehaviorLab(point);
  renderRace(point.date);
  renderMultiverse();
}

function replaySequence() {
  const flow = $("#replay-flow");
  flow.classList.remove("playing");
  void flow.offsetWidth;
  flow.classList.add("playing");
  const microscope = $("#decision-microscope");
  microscope.classList.remove("playing");
  void microscope.offsetWidth;
  microscope.classList.add("playing");
}

function replayBehaviorSequence() {
  const lab = $("#behavior-lab");
  lab.classList.remove("playing");
  void lab.offsetWidth;
  lab.classList.add("playing");
}

function renderBehaviorLab(point) {
  if (!point?.votes?.length) return;
  const vote = point.votes[state.selectedFly] || point.votes[0];
  const actual = Boolean(point.engine);
  const rewardMode = state.behaviorScenario === "reward";
  const steps = t(`behavior.${rewardMode ? "rewardSteps" : "aversiveSteps"}`);
  const details = t(`behavior.${rewardMode ? "rewardDetails" : "aversiveDetails"}`);
  const symbols = rewardMode ? ["A", "+", "DA+", "M", "A", "→"] : ["B", "!", "DA−", "M", "B", "←"];
  $("#behavior-flow").className = `behavior-flow ${rewardMode ? "reward-story" : "aversive-story"}`;
  $("#behavior-flow").innerHTML = steps.map((label, index) => `${index ? `<i class="behavior-link" aria-hidden="true"></i>` : ""}<div class="behavior-step" style="--step-delay:${index * .13}s"><span>${symbols[index]}</span><b>${escapeHtml(label)}</b><small>${escapeHtml(details[index])}</small></div>`).join("");
  $("#behavior-lesson").textContent = t(`behavior.${rewardMode ? "rewardLesson" : "aversiveLesson"}`);

  const leftMarket = state.mappingFlipped ? t("behavior.buy") : t("behavior.sell");
  const rightMarket = state.mappingFlipped ? t("behavior.sell") : t("behavior.buy");
  $("#axis-stack").innerHTML = `
    <div class="behavior-axis motivation-axis"><b>${escapeHtml(t("behavior.motivationAxis"))}</b><span>${escapeHtml(t("behavior.avoidance"))}</span><i></i><span>${escapeHtml(t("behavior.approach"))}</span></div>
    <div class="axis-separator"><span>${escapeHtml(t("behavior.notSame"))}</span></div>
    <div class="behavior-axis motor-axis"><b>${escapeHtml(t("behavior.motorAxis"))}</b><span>${escapeHtml(t("behavior.leftTurn"))}</span><i></i><span>${escapeHtml(t("behavior.rightTurn"))}</span></div>
    <div class="human-translation"><span>↓</span><b>${escapeHtml(t("behavior.humanMapping"))}</b><span>↓</span></div>
    <div class="behavior-axis market-axis ${state.mappingFlipped ? "flipped" : ""}"><b>${escapeHtml(t("behavior.marketAxis"))}</b><span>${escapeHtml(leftMarket)}</span><i></i><span>${escapeHtml(rightMarket)}</span></div>`;

  const rightValue = actual ? `${(Number(vote.rightHz) || 0).toFixed(1)}Hz` : signedNumber(vote.buyDrive, 3);
  const leftValue = actual ? `${(Number(vote.leftHz) || 0).toFixed(1)}Hz` : signedNumber(vote.sellDrive, 3);
  const gateValue = actual ? `${Number(vote.gateSpikes) || 0} ${t("microscope.spikes")}` : "—";
  const rightTitle = actual ? t("behavior.rightNeuron") : t("microscope.buyDrive");
  const leftTitle = actual ? t("behavior.leftNeuron") : t("microscope.sellDrive");
  $("#behavior-readout").innerHTML = `<strong>${escapeHtml(t(actual ? "behavior.actualReadout" : "behavior.proxyReadout"))} · Fly ${vote.fly}</strong><div><span>${escapeHtml(rightTitle)}<b>${rightValue}</b></span><span>${escapeHtml(leftTitle)}<b>${leftValue}</b></span><span>${escapeHtml(t("behavior.gate"))}<b>${gateValue}</b></span></div>`;

  const previewAction = !state.mappingFlipped || vote.action === "HOLD" ? vote.action : vote.action === "BUY" ? "SELL" : "BUY";
  $("#mapping-flip").textContent = t(state.mappingFlipped ? "behavior.restore" : "behavior.flip");
  $("#mapping-preview").textContent = `${t("behavior.result")}: ${actionLabel(vote.action)}${state.mappingFlipped ? ` → ${actionLabel(previewAction)}` : ""}`;
  const mappingRule = state.mappingFlipped
    ? `${t("behavior.flippedRule")} ${t("behavior.previewOnly")}`
    : t("behavior.currentRule");
  $("#mapping-disclosure").textContent = `${t(actual ? "behavior.actualDisclosure" : "behavior.proxyDisclosure")} ${mappingRule}`;
  $$("#behavior-controls [data-behavior-scenario]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.behaviorScenario === state.behaviorScenario)));
  replayBehaviorSequence();
}

function signedNumber(value, digits = 2) {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `${safe >= 0 ? "+" : "−"}${Math.abs(safe).toFixed(digits)}`;
}

function drivePercent(value) {
  return Math.round(100 / (1 + Math.exp(-Number(value || 0) * 5)));
}

function featureRows(features) {
  const labels = t("microscope.features");
  return (features || Array(6).fill(0)).map((raw, index) => {
    const value = Math.max(-1, Math.min(1, Number(raw) || 0));
    const width = Math.abs(value) * 50;
    const side = value >= 0 ? "positive-side" : "negative-side";
    return `<div class="feature-row"><span>${escapeHtml(labels[index] || `F${index + 1}`)}</span><div class="feature-axis"><i class="${side}" style="--feature-width:${width}%"></i></div><b class="${value >= 0 ? "positive" : "negative"}">${signedNumber(value)}</b></div>`;
  }).join("");
}

function renderDecisionMicroscope(point) {
  if (!point?.votes?.length) return;
  state.selectedFly = Math.max(0, Math.min(state.selectedFly, point.votes.length - 1));
  const vote = point.votes[state.selectedFly];
  const actual = Boolean(point.engine);
  const profile = state.data.flyLeague?.profiles?.find((item) => item.fly === vote.fly);
  const viewDays = vote.viewDays || profile?.viewDays || "—";
  const regions = [...(vote.regions || [])];
  const topRegion = regions.sort((a, b) => b.activity - a.activity)[0] || { name: "—", activity: 0 };
  const averageActivity = vote.regions?.length ? vote.regions.reduce((sum, region) => sum + region.activity, 0) / vote.regions.length : 0;
  const reward = Number(point.reward) || 0;
  const buyValue = actual ? Number(vote.rightHz) || 0 : Number(vote.buyDrive) || 0;
  const sellValue = actual ? Number(vote.leftHz) || 0 : Number(vote.sellDrive) || 0;
  const decoderMax = actual ? Math.max(1, buyValue, sellValue) : 100;
  const buyWidth = actual ? buyValue / decoderMax * 100 : drivePercent(buyValue);
  const sellWidth = actual ? sellValue / decoderMax * 100 : drivePercent(sellValue);
  const memorySignal = Number(vote.memorySignal) || 0;
  const memoryMagnitude = Number(vote.memoryMagnitude) || 0;
  const memoryChange = Number(vote.memoryChange) || 0;
  const resultReason = vote.action === "HOLD"
    ? t(actual ? "microscope.holdActual" : "microscope.holdProxy")
    : t(actual ? "microscope.directionalActual" : "microscope.directionalProxy");

  $("#microscope-mode").textContent = t(actual ? "microscope.actualMode" : "microscope.proxyMode");
  $("#microscope-mode").className = `mini-badge ${actual ? "actual-mode" : "proxy-mode"}`;
  $("#microscope-disclosure").textContent = t(actual ? "microscope.actualDisclosure" : "microscope.proxyDisclosure");
  $("#microscope-process").innerHTML = `
    <article class="micro-stage sense-stage">
      <header><span>01</span><b>${escapeHtml(t("microscope.sense"))}</b><small>Fly ${vote.fly} · ${viewDays}${state.locale === "ko" ? "일" : "d"}</small></header>
      <p>${escapeHtml(t(actual ? "microscope.featureContext" : "microscope.featureInput"))}</p>
      <div class="feature-bars">${featureRows(point.features)}</div>
    </article>
    <i class="micro-wire reward-wire" aria-hidden="true"><span></span></i>
    <article class="micro-stage reward-stage ${actual ? "learning-off" : "learning-on"}">
      <header><span>02</span><b>${escapeHtml(t("microscope.rewardMemory"))}</b></header>
      <div class="reward-core ${reward < 0 ? "negative" : "positive"}"><small>${escapeHtml(t("microscope.rewardValue"))}</small><strong>${signedNumber(reward)}</strong></div>
      <p>${escapeHtml(t(actual ? "microscope.rewardOff" : "microscope.rewardActive"))}</p>
      ${actual ? `<div class="learning-switch"><i></i><span>LEARNING OFF</span></div>` : `<div class="memory-readout"><span>${escapeHtml(t("microscope.memorySignal"))}<b>${signedNumber(memorySignal, 3)}</b></span><span>${escapeHtml(t("microscope.memoryStrength"))}<b>${memoryMagnitude.toFixed(3)}</b></span><span>${escapeHtml(t("microscope.memoryDelta"))}<b>${memoryChange.toFixed(4)}</b></span></div>`}
    </article>
    <i class="micro-wire" aria-hidden="true"><span></span></i>
    <article class="micro-stage brain-stage-mini">
      <header><span>03</span><b>${escapeHtml(t("microscope.brain"))}</b><small>${escapeHtml(t(actual ? "microscope.actualBrain" : "microscope.proxyBrain"))}</small></header>
      <div class="neural-orb" style="--activity:${Math.min(100, topRegion.activity)}"><i></i><i></i><i></i><strong>${Math.round(topRegion.activity)}</strong></div>
      <p>${escapeHtml(t("microscope.topRegion"))}<b>${escapeHtml(translatedRegion(topRegion)[0])}</b></p>
      <small>${escapeHtml(t("microscope.averageActivity"))} ${averageActivity.toFixed(0)}</small>
    </article>
    <i class="micro-wire" aria-hidden="true"><span></span></i>
    <article class="micro-stage decoder-stage">
      <header><span>04</span><b>${escapeHtml(t("microscope.decoder"))}</b></header>
      <div class="decoder-row buy"><span>${escapeHtml(t(actual ? "microscope.rightHz" : "microscope.buyDrive"))}</span><div><i style="--decoder-width:${buyWidth}%"></i></div><b>${actual ? `${buyValue.toFixed(1)}Hz` : signedNumber(buyValue, 3)}</b></div>
      <div class="decoder-row sell"><span>${escapeHtml(t(actual ? "microscope.leftHz" : "microscope.sellDrive"))}</span><div><i style="--decoder-width:${sellWidth}%"></i></div><b>${actual ? `${sellValue.toFixed(1)}Hz` : signedNumber(sellValue, 3)}</b></div>
      <div class="decoder-meta"><span>${escapeHtml(t("microscope.difference"))} <b>${signedNumber(vote.difference, actual ? 1 : 3)}${actual ? "Hz" : ""}</b></span><span>${escapeHtml(t("microscope.confidence"))} <b>${Math.round((Number(vote.confidence) || 0) * 100)}%</b></span>${actual ? `<span>${escapeHtml(t("microscope.gate"))} <b>${Number(vote.gateSpikes) || 0} ${escapeHtml(t("microscope.spikes"))}</b></span>` : ""}</div>
    </article>
    <i class="micro-wire" aria-hidden="true"><span></span></i>
    <article class="micro-stage action-stage ${vote.action}">
      <header><span>05</span><b>${escapeHtml(t("microscope.action"))}</b></header>
      <div class="action-orb"><span>Fly ${vote.fly}</span><strong>${escapeHtml(actionLabel(vote.action))}</strong></div>
      <p>${escapeHtml(resultReason)}</p>
    </article>`;

  $$("#replay-flies [data-fly-index]").forEach((button) => {
    const selected = Number(button.dataset.flyIndex) === state.selectedFly;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function renderReplay(point) {
  const move = point.open ? (point.close / point.open - 1) * 100 : 0;
  $("#replay-date").textContent = `${state.symbol} · ${point.date}`;
  $("#replay-market").textContent = localPrice(point.rawClose ?? point.close);
  $("#replay-move").textContent = `${percent(move)} intraday`;
  $("#replay-move").className = move >= 0 ? "positive" : "negative";
  $("#replay-flies").innerHTML = point.votes.map((vote, index) =>
    `<button type="button" class="replay-fly-vote ${vote.action} ${index === state.selectedFly ? "selected" : ""}" data-fly-index="${index}" aria-pressed="${index === state.selectedFly}" style="--delay:${vote.fly * .08}s" title="${escapeHtml(t("microscope.selected"))} ${vote.fly}"><i>${vote.fly}</i><b>${escapeHtml(actionLabel(vote.action))}</b></button>`
  ).join("");

  const counts = { BUY: 0, HOLD: 0, SELL: 0 };
  point.votes.forEach((vote) => { counts[vote.action] += 1; });
  const split = Object.entries(counts).filter(([, count]) => count > 0).map(([action, count]) => `${actionLabel(action)} ${count}`).join(" · ");
  $("#replay-consensus").textContent = actionLabel(point.action);
  $("#replay-split").textContent = split;
  $("#consensus-orb").className = `consensus-orb ${point.action}`;

  const exposure = Math.round(point.riskTarget * 100);
  $("#replay-exposure").textContent = `${exposure}%`;
  $("#replay-dial").style.setProperty("--exposure", exposure);

  const trace = currentTrace();
  const next = trace[state.index + 1];
  if (next) {
    const pnl = next.riskEquity - point.riskEquity;
    const pnlPct = point.riskEquity ? pnl / point.riskEquity * 100 : 0;
    $("#replay-result").textContent = moneySigned(pnl);
    $("#replay-result").className = pnl >= 0 ? "positive" : "negative";
    $("#replay-result-copy").textContent = `${next.date} · ${percent(pnlPct)}`;
  } else {
    $("#replay-result").textContent = "…";
    $("#replay-result").className = "";
    $("#replay-result-copy").textContent = t("awaitingNextSession");
  }

  const sortedCounts = Object.values(counts).sort((a, b) => b - a);
  const deadlock = sortedCounts[0] === sortedCounts[1] && sortedCounts[0] > 0;
  const disagreement = deadlock ? 100 : Math.round((1 - sortedCounts[0] / point.votes.length) * 133);
  $("#discord-fill").style.setProperty("--discord", `${Math.min(100, disagreement)}%`);
  $("#discord-readout").textContent = `${Math.min(100, disagreement)}`;
  $("#discord-copy").textContent = deadlock ? t("discordDeadlock") : disagreement > 45 ? t("discordTense") : t("discordCalm");
  renderDecisionMicroscope(point);
  replaySequence();
}

function leaguePointAt(curve, date) {
  return curve.findLast((point) => point.date <= date) || curve[0];
}

function renderRace(date) {
  const league = state.data.flyLeague;
  if (!league) return;
  const runners = league.profiles.map((profile) => {
    const curve = league.curves[`fly${profile.fly}`];
    const point = leaguePointAt(curve, date);
    const baseline = curve.find((item) => item.date >= state.rangeStart) || curve[0];
    const value = point.value / baseline.value * state.data.settings.initialCash;
    const returnPct = (value / state.data.settings.initialCash - 1) * 100;
    return { ...profile, value, returnPct };
  });
  const ordered = [...runners].sort((a, b) => b.value - a.value);
  const rank = new Map(ordered.map((runner, index) => [runner.fly, index + 1]));
  const values = runners.map((runner) => runner.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  $("#race-date").textContent = date;
  $("#racetrack").innerHTML = runners.map((runner) => {
    const progress = max === min ? 50 : 12 + (runner.value - min) / (max - min) * 76;
    return `<div class="race-lane ${rank.get(runner.fly) === 1 ? "leader" : ""}" style="--race-progress:${progress}%;--lane:${runner.fly}">
      <div class="race-meta"><b>${state.locale === "ko" ? `${rank.get(runner.fly)}${t("rank")}` : `${t("rank")}${rank.get(runner.fly)}`}</b><span>Fly ${runner.fly} · ${escapeHtml(t(`flyNames.${runner.fly}`))}</span><small>${runner.viewDays}${state.locale === "ko" ? "일" : "d"}</small></div>
      <div class="lane-line"><i class="start-mark"></i><div class="racing-fly"><span></span><b>F${runner.fly}</b></div><i class="finish-mark"></i></div>
      <div class="race-score"><strong>${percent(runner.returnPct)}</strong><span>${money(runner.value)}</span></div>
    </div>`;
  }).join("");
}

function renderMultiverse() {
  const trace = currentTrace();
  if (trace.length < 2) return;
  const decisionIndex = Math.min(state.index, trace.length - 2);
  const point = trace[decisionIndex];
  const next = trace[decisionIndex + 1];
  const move = next.open ? next.close / next.open - 1 : 0;
  const actualExposure = point.riskTarget;
  const oppositeExposure = 1 - actualExposure;
  const sleeve = state.data.settings.sleeveCash;
  const actualPnl = sleeve * actualExposure * move;
  const oppositePnl = sleeve * oppositeExposure * move;
  const scale = Math.max(1, Math.abs(actualPnl), Math.abs(oppositePnl));

  $("#multiverse-date").textContent = `${point.date} → ${next.date}`;
  $("#actual-world-pnl").textContent = moneySigned(actualPnl);
  $("#actual-world-pnl").className = actualPnl >= 0 ? "positive" : "negative";
  $("#actual-world-exposure").textContent = `${Math.round(actualExposure * 100)}% ${t("exposureWord")}`;
  $("#actual-world-bar").style.setProperty("--world-bar", `${Math.abs(actualPnl) / scale * 100}%`);
  $("#actual-world-bar").className = actualPnl >= 0 ? "positive-bar" : "negative-bar";
  $("#opposite-world-pnl").textContent = moneySigned(oppositePnl);
  $("#opposite-world-pnl").className = oppositePnl >= 0 ? "positive" : "negative";
  $("#opposite-world-exposure").textContent = `${Math.round(oppositeExposure * 100)}% ${t("exposureWord")}`;
  $("#opposite-world-bar").style.setProperty("--world-bar", `${Math.abs(oppositePnl) / scale * 100}%`);
  $("#opposite-world-bar").className = oppositePnl >= 0 ? "positive-bar" : "negative-bar";
  const difference = actualPnl - oppositePnl;
  $("#multiverse-verdict").textContent = Math.abs(difference) < 1 ? t("worldsTie") : difference > 0 ? t("actualWorldWins") : t("oppositeWorldWins");
  $("#multiverse-verdict").className = `multiverse-verdict ${difference >= 0 ? "actual-win" : "opposite-win"}`;
}

function renderCandles() {
  const chart = $("#candle-chart");
  chart.replaceChildren();
  const trace = currentTrace();
  const start = Math.max(0, state.index - 39);
  const bars = trace.slice(start, state.index + 1);
  const width = Math.max(480, chart.clientWidth || 700);
  const height = 300;
  const margin = { top: 12, right: 56, bottom: 24, left: 8 };
  chart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const min = Math.min(...bars.map((bar) => bar.low));
  const max = Math.max(...bars.map((bar) => bar.high));
  const y = (value) => margin.top + (max - value) / Math.max(Number.EPSILON, max - min) * (height - margin.top - margin.bottom);
  const step = (width - margin.left - margin.right) / Math.max(1, bars.length);
  for (let index = 0; index <= 4; index++) {
    const value = min + (max - min) * index / 4;
    const yy = y(value);
    chart.append(svg("line", { x1: margin.left, y1: yy, x2: width - margin.right, y2: yy, class: "grid" }));
    const label = svg("text", { x: width - margin.right + 7, y: yy + 3 });
    label.textContent = new Intl.NumberFormat(state.locale === "ko" ? "ko-KR" : "en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
    chart.append(label);
  }
  bars.forEach((bar, index) => {
    const xx = margin.left + step * index + step / 2;
    const rising = bar.close >= bar.open;
    const color = rising ? "#54e6aa" : "#ff7b86";
    chart.append(svg("line", { x1: xx, x2: xx, y1: y(bar.high), y2: y(bar.low), stroke: color, "stroke-width": 1 }));
    const top = y(Math.max(bar.open, bar.close));
    const bottom = y(Math.min(bar.open, bar.close));
    chart.append(svg("rect", { x: xx - Math.max(2, step * .28), y: top, width: Math.max(4, step * .56), height: Math.max(2, bottom - top), fill: rising ? "rgba(84,230,170,.72)" : "rgba(255,123,134,.72)", stroke: color }));
  });
}

function renderMarketSignals(point) {
  const labels = t("microscope.features");
  $("#market-signal-strip").innerHTML = `
    <div class="market-signal-head"><strong>${escapeHtml(t("marketSignals"))}</strong><span>${escapeHtml(t(point.engine ? "marketSignalsActual" : "marketSignalsProxy"))}</span></div>
    <div class="market-signal-grid">${(point.features || Array(6).fill(0)).map((raw, index) => {
      const value = Math.max(-1, Math.min(1, Number(raw) || 0));
      return `<div class="market-signal ${value >= 0 ? "signal-positive" : "signal-negative"}"><small>${escapeHtml(labels[index] || `F${index + 1}`)}</small><strong>${signedNumber(value)}</strong><div><i style="--signal-position:${(value + 1) * 50}%"></i></div></div>`;
    }).join("")}</div>`;
}

function pointAtOrBefore(trace, date) {
  return trace.findLast((point) => point.date <= date) || trace[0];
}

function shareNumber(value) {
  return new Intl.NumberFormat(state.locale === "ko" ? "ko-KR" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 4 }).format(value || 0);
}

function renderHoldings(date) {
  const baselinePoint = state.data.curves.flyRisk.find((point) => point.date >= state.rangeStart) || state.data.curves.flyRisk[0];
  const baselineDate = baselinePoint?.date || state.rangeStart;
  const baselineEquity = Number(baselinePoint?.value) || state.data.settings.initialCash;
  const scale = baselineEquity ? state.data.settings.initialCash / baselineEquity : 1;
  const rows = state.data.symbols.map((meta) => {
    const point = pointAtOrBefore(state.data.sleeves[meta.symbol].trace, date);
    const equity = (Number(point?.riskEquity) || 0) * scale;
    const stock = (Number(point?.riskStockValue) || 0) * scale;
    const cash = (Number(point?.riskCash) || 0) * scale;
    return {
      meta,
      point,
      equity,
      stock,
      cash,
      shares: (Number(point?.riskShares) || 0) * scale,
      actualExposure: equity ? stock / equity : 0,
      nextTarget: Number(point?.riskTarget) || 0
    };
  });
  const totalEquity = rows.reduce((sum, row) => sum + row.equity, 0);
  const totalStock = rows.reduce((sum, row) => sum + row.stock, 0);
  const totalCash = rows.reduce((sum, row) => sum + row.cash, 0);
  const nextTarget = totalEquity ? rows.reduce((sum, row) => sum + row.nextTarget * row.equity, 0) / totalEquity : 0;

  $("#holdings-date").textContent = `${date} · ${t("periodBasis")}`;
  $("#holdings-equity").textContent = money(totalEquity);
  $("#holdings-stock").textContent = money(totalStock);
  $("#holdings-cash").textContent = money(totalCash);
  $("#holdings-actual-exposure").textContent = `${(totalEquity ? totalStock / totalEquity * 100 : 0).toFixed(1)}%`;
  $("#holdings-next-target").textContent = `${(nextTarget * 100).toFixed(1)}%`;
  $("#holdings-table").innerHTML = rows.map((row) => `<tr class="${row.meta.symbol === state.symbol ? "selected-holding" : ""}">
    <td><strong>${escapeHtml(row.meta.name)}</strong><small>${escapeHtml(row.meta.symbol)} · ${escapeHtml(t("asOf"))} ${row.point?.date || "—"}${row.point?.riskExecuted ? ` · ${escapeHtml(t("rebalanced"))}` : ` · ${escapeHtml(t("carried"))}`}</small></td>
    <td>${shareNumber(row.shares)}</td>
    <td>${escapeHtml(localPrice(row.point?.rawClose ?? row.point?.close ?? 0, row.meta.symbol))}</td>
    <td>${money(row.stock)}</td>
    <td>${money(row.cash)}</td>
    <td><b class="holding-exposure">${(row.actualExposure * 100).toFixed(1)}%</b></td>
    <td><b class="holding-target">${Math.round(row.nextTarget * 100)}%</b></td>
  </tr>`).join("");
  $("#holdings-footnote").textContent = `${t("holdingsFootnote")} ${baselineDate} ${state.locale === "ko" ? "평가액을 $10,000으로 비례 환산했습니다." : "account value is proportionally rebased to $10,000."}`;
}

function renderBrain(point) {
  state.selectedFly = Math.max(0, Math.min(state.selectedFly, point.votes.length - 1));
  const vote = point.votes[state.selectedFly] || point.votes[0];
  const regions = vote?.regions || [];
  const visibleRegions = regions.slice(0, BRAIN_POINTS.length);
  const activities = visibleRegions.map((region) => region.activity);
  const lowest = Math.min(...activities, 0);
  const highest = Math.max(...activities, 1);
  const visualScore = (activity) => Math.round(Math.pow((activity - lowest) / Math.max(1, highest - lowest), 1.65) * 100);
  const ranking = new Map([...visibleRegions].sort((a, b) => b.activity - a.activity).map((region, index) => [region.name, index + 1]));
  state.selectedRegion = Math.min(state.selectedRegion, Math.max(0, visibleRegions.length - 1));
  $("#regions").className = `regions ${visibleRegions.length > 8 ? "expanded" : ""}`;
  $("#regions").innerHTML = visibleRegions.map((region, index) => {
    const [name, help] = translatedRegion(region);
    const salience = visualScore(region.activity);
    const rank = ranking.get(region.name);
    return `<div class="region ${rank === 1 ? "dominant" : rank <= 3 ? "strong" : "quiet"}" data-region-index="${index}"><button type="button" class="region-label tooltip-trigger" data-region-index="${index}" data-tooltip="${escapeHtml(help)}" aria-label="${escapeHtml(`${name}: ${help}`)}"><span><em>${rank}</em>${escapeHtml(name)}</span><i>i</i></button><div class="region-track" aria-hidden="true"><i style="--width:${Math.max(2, salience)}%"></i></div><b>${region.activity}</b></div>`;
  }).join("");
  $("#brain-hotspots").innerHTML = visibleRegions.map((region, index) => {
    const [name] = translatedRegion(region);
    const point3d = BRAIN_POINTS[index];
    const rank = ranking.get(region.name);
    const salience = visualScore(region.activity);
    const size = 8 + salience * 0.17;
    return `<button type="button" class="brain-hotspot ${rank === 1 ? "dominant" : rank <= 3 ? "strong" : "quiet"} ${point3d.x > 20 ? "label-left" : ""}" data-region-index="${index}" aria-label="${escapeHtml(`${name} · ${region.activity}/100`)}" style="--x:${point3d.x}px;--y:${point3d.y}px;--z:${point3d.z}px;--spot:${point3d.color};--spot-size:${size}px;--spot-glow:${8 + salience * .18}px"><i></i><span>#${rank} ${escapeHtml(name)}</span></button>`;
  }).join("");
  const average = mean(regions.map((region) => region.activity));
  $("#brain-scene").style.setProperty("--brain-rotation", `${state.brainRotation}deg`);
  $("#brain-scene").style.setProperty("--brain-glow", `${Math.round(12 + highest * .55)}px`);
  $("#brain-fly-badge").textContent = `Fly ${vote.fly} · ${point.engine ? t("actualMaleCns") : t("proxyReplay")}`;
  renderDecoderAnatomy(vote, Boolean(point.engine));
  selectBrainRegion(state.selectedRegion);

  const exposure = Math.round(point.riskTarget * 100);
  const activeStep = Math.max(0, EXPOSURE_LEVELS.indexOf(exposure));
  $("#exposure-readout").textContent = `${exposure}% · ${activeStep + 1}/10 ${t("stepOf")}`;
  $("#exposure-ladder").innerHTML = EXPOSURE_LEVELS.map((level, index) =>
    `<span class="${index === activeStep ? "active" : ""} ${index < activeStep ? "passed" : ""}"><i></i><b>${level}%</b></span>`
  ).join("");
}

function renderDecoderAnatomy(vote, actual) {
  const buyRaw = actual ? Number(vote.rightHz) || 0 : Number(vote.buyDrive) || 0;
  const sellRaw = actual ? Number(vote.leftHz) || 0 : Number(vote.sellDrive) || 0;
  const gateRegion = vote.regions?.find((region) => region.name === "운동게이트");
  const gateRaw = actual ? Number(vote.gateSpikes) || 0 : Number(gateRegion?.activity) || 0;
  const sideMax = Math.max(1, Math.abs(buyRaw), Math.abs(sellRaw));
  const buyStrength = actual ? buyRaw / sideMax * 100 : drivePercent(buyRaw);
  const sellStrength = actual ? sellRaw / sideMax * 100 : drivePercent(sellRaw);
  const gateStrength = actual ? Math.min(100, gateRaw * 5) : gateRaw;
  const buyWins = vote.action === "BUY";
  const sellWins = vote.action === "SELL";

  $("#brain-decoders").innerHTML = `
    <div class="decoder-node sell ${sellWins ? "winner" : ""}" style="--node-strength:${sellStrength}%"><i></i><span>${escapeHtml(t("anatomy.sell"))}</span></div>
    <div class="decoder-node gate ${vote.action !== "HOLD" ? "winner" : ""}" style="--node-strength:${gateStrength}%"><i></i><span>${escapeHtml(t("anatomy.gate"))}</span></div>
    <div class="decoder-node buy ${buyWins ? "winner" : ""}" style="--node-strength:${buyStrength}%"><i></i><span>${escapeHtml(t("anatomy.buy"))}</span></div>`;

  const buyValue = actual ? `${buyRaw.toFixed(1)}Hz` : signedNumber(buyRaw, 3);
  const sellValue = actual ? `${sellRaw.toFixed(1)}Hz` : signedNumber(sellRaw, 3);
  const gateValue = actual ? `${gateRaw} ${t("microscope.spikes")}` : `${Math.round(gateRaw)}/100`;
  $("#decoder-anatomy").innerHTML = `
    <div class="anatomy-title"><strong>${escapeHtml(t("anatomy.title"))}</strong><span>${escapeHtml(t(actual ? "anatomy.actualNote" : "anatomy.proxyNote"))}</span></div>
    <article><i class="sensory-dot"></i><div><b>${escapeHtml(t("anatomy.sensory"))}</b><p>${escapeHtml(t("anatomy.sensoryCopy"))}</p></div></article>
    <article><i class="integration-dot"></i><div><b>${escapeHtml(t("anatomy.integration"))}</b><p>${escapeHtml(t("anatomy.integrationCopy"))}</p></div></article>
    <article class="${buyWins ? "winner" : ""}"><i class="buy-dot"></i><div><b>${escapeHtml(t("anatomy.buy"))} · ${buyValue}</b><p>${escapeHtml(t("anatomy.buyCopy"))}</p></div></article>
    <article class="${sellWins ? "winner" : ""}"><i class="sell-dot"></i><div><b>${escapeHtml(t("anatomy.sell"))} · ${sellValue}</b><p>${escapeHtml(t("anatomy.sellCopy"))}</p></div></article>
    <article class="${vote.action !== "HOLD" ? "winner" : ""}"><i class="gate-dot"></i><div><b>${escapeHtml(t("anatomy.gate"))} · ${gateValue}</b><p>${escapeHtml(t("anatomy.gateCopy"))}</p></div></article>`;
}

function translatedRegion(region) {
  const translated = t(`regions.${region.name}`);
  return Array.isArray(translated)
    ? translated
    : [region.name, state.locale === "ko" ? "이 영역의 정규화된 상대 활성도입니다." : "Normalized relative activity for this region."];
}

function selectBrainRegion(index) {
  const region = currentPoint()?.votes?.[state.selectedFly]?.regions?.[index];
  if (!region) return;
  state.selectedRegion = index;
  const [name, help] = translatedRegion(region);
  $("#selected-region-name").textContent = name;
  $("#selected-region-copy").textContent = help;
  $("#selected-region-activity").textContent = `${region.activity}/100`;
  $$("[data-region-index]").forEach((element) => element.classList.toggle("active", Number(element.dataset.regionIndex) === index));
}

function rotateBrain(delta) {
  state.brainRotation = (state.brainRotation + delta) % 360;
  $("#brain-scene").style.setProperty("--brain-rotation", `${state.brainRotation}deg`);
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function actionColor(action) {
  return action === "BUY" ? "#54e6aa" : action === "SELL" ? "#ff7b86" : "#ffcb69";
}

function renderVotes(votes) {
  $("#votes").innerHTML = votes.map((vote, index) =>
    `<button type="button" class="vote ${index === state.selectedFly ? "selected" : ""}" data-vote-fly-index="${index}" aria-pressed="${index === state.selectedFly}" style="--color:${actionColor(vote.action)}"><div class="fly-avatar">${vote.fly}</div><div><h3>Fly ${vote.fly}${vote.viewDays ? ` · ${vote.viewDays} ${t("viewDays")}` : ""}</h3><div class="confidence"><i style="--confidence:${Math.round(vote.confidence * 100)}%"></i></div></div><div class="decision">${actionLabel(vote.action)}<br><small>${Math.round(vote.confidence * 100)}%</small></div></button>`
  ).join("");
}

function renderTable() {
  const rows = currentTrace().slice(Math.max(0, state.index - 7), state.index + 1).reverse();
  $("#decision-table").innerHTML = rows.map((row) =>
    `<tr><td>${row.date}</td><td class="action ${row.action}">${actionLabel(row.action)}</td><td>${((Number(row.riskActualExposure) || 0) * 100).toFixed(1)}%</td><td>${Math.round(row.riskTarget * 100)}%</td><td>${escapeHtml(localPrice(row.rawClose ?? row.close))}</td><td class="${row.reward < 0 ? "negative" : "positive"}">${row.reward.toFixed(2)}</td></tr>`
  ).join("");
}

function stopPlayback() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
  $("#play-button").textContent = "▶";
  $("#play-button").setAttribute("aria-label", t("play"));
}

function togglePlayback() {
  if (state.timer) return stopPlayback();
  const minimum = Number($("#time-slider").min) || 0;
  const maximum = Number($("#time-slider").max) || currentTrace().length - 1;
  if (state.index >= maximum) state.index = Math.max(minimum, state.index - 40);
  $("#play-button").textContent = "Ⅱ";
  $("#play-button").setAttribute("aria-label", t("pause"));
  state.timer = setInterval(() => {
    state.index += 1;
    if (state.index >= maximum) stopPlayback();
    $("#time-slider").value = state.index;
    renderSelected();
  }, 420);
}

$("#symbol-select").addEventListener("change", (event) => {
  stopPlayback();
  state.symbol = event.target.value;
  updateTimelineBounds(true);
  renderSelected();
});

$("#strategy-select").addEventListener("change", (event) => { state.strategy = event.target.value; renderAll(); });
$("#period-presets").addEventListener("click", (event) => {
  const button = event.target.closest("[data-period]");
  if (!button || !state.data) return;
  const preset = button.dataset.period;
  const curve = state.data.curves.flyRisk;
  const end = curve.at(-1).date;
  const years = { "1Y": 1, "3Y": 3, "5Y": 5 }[preset];
  const start = preset === "MAX" ? curve[0].date : shiftedStart(end, years);
  setPerformancePeriod(start, end, preset);
});
$("#period-apply").addEventListener("click", () => {
  if (!state.data) return;
  setPerformancePeriod($("#period-start").value, $("#period-end").value, "CUSTOM");
});
$("#time-slider").addEventListener("input", (event) => { stopPlayback(); state.index = Number(event.target.value); renderSelected(); });
$("#play-button").addEventListener("click", togglePlayback);
$("#rerun-button").addEventListener("click", loadDashboard);
$("#replay-button").addEventListener("click", replaySequence);
$("#behavior-controls").addEventListener("click", (event) => {
  const button = event.target.closest("[data-behavior-scenario]");
  if (!button) return;
  state.behaviorScenario = button.dataset.behaviorScenario;
  renderBehaviorLab(currentPoint());
});
$("#behavior-replay").addEventListener("click", replayBehaviorSequence);
$("#mapping-flip").addEventListener("click", () => {
  state.mappingFlipped = !state.mappingFlipped;
  renderBehaviorLab(currentPoint());
});
function selectFlyAtIndex(index) {
  const point = currentPoint();
  if (!point) return;
  state.selectedFly = Math.max(0, Math.min(index, point.votes.length - 1));
  renderDecisionMicroscope(point);
  renderBrain(point);
  renderVotes(point.votes);
  renderBehaviorLab(point);
}

$("#replay-flies").addEventListener("click", (event) => {
  const button = event.target.closest("[data-fly-index]");
  if (!button) return;
  selectFlyAtIndex(Number(button.dataset.flyIndex));
});
$("#votes").addEventListener("click", (event) => {
  const button = event.target.closest("[data-vote-fly-index]");
  if (!button) return;
  selectFlyAtIndex(Number(button.dataset.voteFlyIndex));
});
$("#brain-turn-left").addEventListener("click", () => rotateBrain(-24));
$("#brain-turn-right").addEventListener("click", () => rotateBrain(24));

for (const eventName of ["click", "focusin", "pointerover"]) {
  $("#brain-hotspots").addEventListener(eventName, (event) => {
    const target = event.target.closest("[data-region-index]");
    if (target) selectBrainRegion(Number(target.dataset.regionIndex));
  });
  $("#regions").addEventListener(eventName, (event) => {
    const target = event.target.closest("[data-region-index]");
    if (target) selectBrainRegion(Number(target.dataset.regionIndex));
  });
}

let brainDragStart = null;
$("#brain-stage").addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  brainDragStart = { x: event.clientX, rotation: state.brainRotation };
  $("#brain-stage").setPointerCapture(event.pointerId);
  $("#brain-stage").classList.add("dragging");
});
$("#brain-stage").addEventListener("pointermove", (event) => {
  if (!brainDragStart) return;
  state.brainRotation = brainDragStart.rotation + (event.clientX - brainDragStart.x) * .65;
  $("#brain-scene").style.setProperty("--brain-rotation", `${state.brainRotation}deg`);
});
function endBrainDrag() {
  brainDragStart = null;
  $("#brain-stage").classList.remove("dragging");
}
$("#brain-stage").addEventListener("pointerup", endBrainDrag);
$("#brain-stage").addEventListener("pointercancel", endBrainDrag);
$("#brain-stage").addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") { event.preventDefault(); rotateBrain(-12); }
  if (event.key === "ArrowRight") { event.preventDefault(); rotateBrain(12); }
});
$("#update-button").addEventListener("click", async () => {
  setBusy(true, t("updating"));
  try {
    if (state.staticMode) {
      await loadDashboard(true);
      return;
    }
    const response = await fetch("/api/update", { method: "POST" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
    await loadDashboard();
  } catch (error) {
    showNotice(t("updateFailed"), `${error.message} ${t("cacheKept")}`, "warn");
  } finally {
    setBusy(false);
  }
});

$$('[data-locale]').forEach((button) => button.addEventListener("click", () => {
  state.locale = button.dataset.locale;
  localStorage.setItem("flyfund-locale", state.locale);
  applyLocale();
}));

window.addEventListener("resize", () => { if (state.data) { renderPerformance(); renderCandles(); } });

applyLocale();
loadDashboard();
