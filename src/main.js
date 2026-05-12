import './style.css'

const app = document.querySelector('#app')

// -- Global State --
let state = {
  view: 'splash',
  name: '', gender: 'male', age: 45, height: 172,
  weight: 75, muscle: 32, bfr: 22, visceral: 8,
  bmi: 24.5, isPremium: false
}

// -- Clinical Data Base --
const Standards = {
  male: {
    bmi: { min: 18.5, max: 23, unit: '', label: "체질량(BMI)" },
    muscle: { min: 32, max: 38, unit: 'kg', label: "골격근량(Muscle)" },
    bfr: { min: 10, max: 20, unit: '%', label: "체지방률(Fat)" },
    visceral: { min: 1, max: 9, unit: 'Lv', label: "내장지방(Visceral)" }
  },
  female: {
    bmi: { min: 18.5, max: 23, unit: '', label: "체질량(BMI)" },
    muscle: { min: 22, max: 28, unit: 'kg', label: "골격근량(Muscle)" },
    bfr: { min: 18, max: 28, unit: '%', label: "체지방률(Fat)" },
    visceral: { min: 1, max: 9, unit: 'Lv', label: "내장지방(Visceral)" }
  }
}

const TypeData = {
  "표준체중보통형": { desc: "신체 밸런스가 매우 이상적인 상태입니다. 현재의 대사 효율을 유지하는 예방적 관리가 필요합니다.", pm: ["파워칵테일", "리스토레이트"] },
  "표준체중강인형": { desc: "근육량이 매우 우수하며 대사 능력이 활발한 상태입니다. 운동 후 회복과 에너지 유지에 집중하세요.", pm: ["아미노", "리스토레이트", "액티바이즈"] },
  "표준체중비만형": { desc: "체중은 정상이나 체지방률이 높은 '마른 비만' 상태입니다. 지방 연소와 세포 해독이 시급합니다.", pm: ["액티바이즈", "C-Balance", "디드링크"] },
  "표준체중허약형": { desc: "체중은 정상이나 근육량이 부족하여 대사 효율이 낮습니다. 단백질 흡수와 대사 활성화가 필요합니다.", pm: ["아미노", "파워칵테일", "리스토레이트"] },
  "저체중허약형": { desc: "에너지가 고갈된 상태로, 면역력과 근력이 매우 낮습니다. 집중적인 영양 보강과 신체 재건이 필요합니다.", pm: ["파워칵테일", "리스토레이트", "아미노"] },
  "저체중강인형": { desc: "체중은 낮으나 근육의 질이 좋고 탄탄한 체형입니다. 현재의 활력을 위해 필수 미네랄 공급을 지속하세요.", pm: ["리스토레이트", "제슈츠"] },
  "과체중허약형": { desc: "체중은 높지만 근육이 체중을 지탱하지 못하는 위험 단계입니다. 지방 연소와 근력 보강이 병행되어야 합니다.", pm: ["액티바이즈", "아미노", "리스토레이트"] },
  "과체중강인형": { desc: "체중과 근육이 모두 높은 운동선수형 체형입니다. 신체 산성도 조절과 염증 관리에 집중하세요.", pm: ["리스토레이트", "제슈츠", "액티바이즈"] },
  "과체중비만형": { desc: "체중과 체지방이 모두 높은 고위험 상태입니다. 강력한 체지방 연소와 내장지방 독소 배출이 시급합니다.", pm: ["C-Balance", "디드링크", "액티바이즈", "리스토레이트"] }
}

const ProductInfo = {
  "액티바이즈": "산소 흡수율을 높여 체지방 연소와 에너지 대사를 즉각적으로 가속화합니다.",
  "파워칵테일": "56가지 효소와 영양소로 대사 정체를 해결하고 장내 환경을 최적화합니다.",
  "리스토레이트": "미네랄 보강과 신체 산성도 조절을 통해 세포 재생과 독소 배출을 돕습니다.",
  "C-Balance": "당 대사를 관리하여 식후 급격한 혈당 상승과 지방 축적을 원천 차단합니다.",
  "디드링크": "간과 림프의 해독 경로를 활성화하여 체내 깊숙이 쌓인 노폐물을 정화합니다.",
  "아미노": "필수 아미노산을 직접 공급하여 손실된 근육 조직을 복구하고 기초 대사를 강화합니다.",
  "제슈츠": "항산화 작용으로 세포 노화를 방지하고 외부 위협으로부터 신체를 보호합니다."
}

// -- Engine --
const AIEngine = {
  calculateBMI: (w, h) => {
    if (!w || !h || h === 0) return 0
    return (w / ((h / 100) ** 2)).toFixed(1)
  },
  classify: (u) => {
    const bmi = AIEngine.calculateBMI(u.weight, u.height)
    const std = u.gender === 'male' ? Standards.male : Standards.female
    const isUnderweight = bmi < 18.5
    const isOverweight = bmi >= 25
    const isNormalWeight = !isUnderweight && !isOverweight
    if (isUnderweight) return u.muscle < std.muscle.min ? "저체중허약형" : "저체중강인형"
    if (isNormalWeight) {
      if (u.bfr > std.bfr.max) return "표준체중비만형"
      if (u.muscle < std.muscle.min) return "표준체중허약형"
      if (u.muscle > std.muscle.max) return "표준체중강인형"
      return "표준체중보통형"
    }
    if (u.muscle > std.muscle.max) return "과체중강인형"
    if (u.bfr > std.bfr.max) return "과체중비만형"
    return "과체중허약형"
  }
}

// -- Components --

const NavHeader = (targetView) => `
  <div style="padding: 20px 24px; display:flex; align-items:center; position:sticky; top:0; z-index:100; background:rgba(255,255,255,0.9); backdrop-filter:blur(10px);">
    <button onclick="window.setView('${targetView}')" style="background:none; border:none; font-size:1.4rem; color:var(--brand-primary); cursor:pointer; padding:5px;">
      <i class="fas fa-arrow-left"></i>
    </button>
    <div style="flex:1; text-align:center; font-size:0.8rem; font-weight:800; letter-spacing:2px; color:var(--brand-accent); margin-right:30px;">PM FITEXPERT</div>
  </div>
`

const MetricMeter = (label, current, std) => {
  const safeCurrent = isNaN(current) ? 0 : current
  const percent = Math.min(Math.max((safeCurrent / (std.max * 1.5)) * 100, 0), 100)
  const minPos = (std.min / (std.max * 1.5)) * 100
  const maxPos = (std.max / (std.max * 1.5)) * 100
  const status = safeCurrent < std.min ? '부족' : (safeCurrent > std.max ? '과다' : '적정')
  const isBad = status === '부족' || status === '과다'
  const displayColor = isBad ? 'var(--brand-danger)' : 'var(--brand-success)'

  return `
    <div class="modern-meter reveal">
      <div class="meter-info" style="margin-bottom:12px;">
        <span class="meter-name" style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">${label}</span>
        <div style="text-align:right;">
          <span style="font-size:1.25rem; font-weight:800; font-family:var(--font-montserrat);">${safeCurrent}</span>
          <span style="font-size:0.9rem; font-weight:${isBad?'900':'700'}; color:${displayColor}; margin-left:4px;">
            ${status}
          </span>
        </div>
      </div>
      <div class="meter-track" style="height:10px; background:#f1f5f9; border-radius:100px;">
        <div class="meter-range-indicator" style="left:${minPos}%; width:${maxPos-minPos}%; background:rgba(16, 185, 129, 0.1);"></div>
        <div class="meter-fill" style="width:${percent}%; background:${displayColor}; opacity:0.3; border-radius:100px;"></div>
        <div class="meter-pin" style="left:${percent}%; width:3px; height:22px; top:-6px; background:var(--brand-primary); border-radius:100px;"></div>
      </div>
    </div>
  `
}

// -- Views --

const SplashView = () => `
  <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; padding:40px; text-align:center;" class="reveal">
    <h1 style="font-size:3rem; font-weight:900; color:var(--brand-primary); margin-bottom:12px; letter-spacing:-1px;">FitLine Health AI</h1>
    <h2 style="font-size:1.2rem; color:var(--brand-accent); font-weight:700; margin-bottom:50px; letter-spacing:0px;">데이터로 증명하는 건강 맞춤 가이드</h2>
    <p style="color:var(--text-secondary); line-height:2; font-size:1.05rem; padding:0 10px;">
      맞춤형 인바디 데이터를 기반으로<br>당신의 최적화된 신체 밸런스를 디자인합니다.
    </p>
    <button class="btn-luxury" style="margin-top:80px;" onclick="window.setView('input')">상담 시작하기</button>
  </div>
`

const InputView = () => `
  ${NavHeader('splash')}
  <div class="section-container reveal" style="padding-top:20px;">
    <h2 style="font-size:1.8rem; font-weight:900; margin-bottom:40px; letter-spacing:-1px;">정밀 데이터 입력</h2>
    
    <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:30px; padding:50px 20px; text-align:center; position:relative; margin-bottom:40px;">
      <div id="scan-feedback" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.9); display:none; justify-content:center; align-items:center; z-index:5; border-radius:30px;">
        <div style="font-weight:900; color:var(--brand-accent); letter-spacing:2px;">AI SCANNING...</div>
      </div>
      <i class="fas fa-camera-retro" style="font-size:2.5rem; color:var(--brand-accent); margin-bottom:15px; opacity:0.6;"></i>
      <div style="font-weight:800; font-size:1.1rem;">인바디 결과지 판독</div>
      <input type="file" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer;" accept="image/*" onchange="window.handleOCR(this)">
    </div>

    <div style="margin-top:30px;">
      <div class="input-group" style="margin-bottom:25px;">
        <label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:10px;">성명(Name)</label>
        <input type="text" style="width:100%; padding:18px; border-radius:15px; border:1px solid #e2e8f0; font-size:1.1rem;" value="${state.name}" onchange="window.updateState('name', this.value)">
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
        <div class="input-group"><label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:8px;">키(Height).cm</label><input type="number" style="width:100%; padding:15px; border-radius:15px; border:1px solid #e2e8f0;" value="${state.height}" onchange="window.updateState('height', this.value)"></div>
        <div class="input-group"><label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:8px;">나이(Age).세</label><input type="number" style="width:100%; padding:15px; border-radius:15px; border:1px solid #e2e8f0;" value="${state.age}" onchange="window.updateState('age', this.value)"></div>
        <div class="input-group"><label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:8px;">체중(Weight).kg</label><input type="number" style="width:100%; padding:15px; border-radius:15px; border:1px solid #e2e8f0;" value="${state.weight}" onchange="window.updateState('weight', this.value)"></div>
        <div class="input-group"><label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:8px;">골격근량(Muscle).kg</label><input type="number" style="width:100%; padding:15px; border-radius:15px; border:1px solid #e2e8f0;" value="${state.muscle}" onchange="window.updateState('muscle', this.value)"></div>
        <div class="input-group"><label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:8px;">체지방률(Fat).%</label><input type="number" style="width:100%; padding:15px; border-radius:15px; border:1px solid #e2e8f0;" value="${state.bfr}" onchange="window.updateState('bfr', this.value)"></div>
        <div class="input-group"><label style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:8px;">내장지방(Visceral).Lv</label><input type="number" style="width:100%; padding:15px; border-radius:15px; border:1px solid #e2e8f0;" value="${state.visceral}" onchange="window.updateState('visceral', this.value)"></div>
      </div>
    </div>

    <button class="btn-luxury" style="width:100%; margin-top:30px;" onclick="window.startAnalysis()">심층 분석 리포트 생성</button>
  </div>
`

const AnalysisView = () => {
  const bmi = AIEngine.calculateBMI(state.weight, state.height)
  state.bmi = bmi
  const typeName = AIEngine.classify(state)
  const type = TypeData[typeName]
  const std = state.gender === 'male' ? Standards.male : Standards.female

  return `
    ${NavHeader('input')}
    <div class="diagnosis-header reveal" style="padding-top:20px;">
      <div class="type-badge" style="background:var(--brand-primary); color:white; padding:8px 20px;">SCENE 3: ANALYSIS</div>
      <h1 class="type-title" style="font-size:2rem; margin-top:20px;">${state.name || '고객'}님의 건강 유형은<br><span style="color:var(--brand-accent);">${typeName}</span></h1>
      <p style="padding:0 30px; color:var(--text-secondary); line-height:1.8; font-size:1rem;">${type.desc}</p>
    </div>

    <div class="section-container" style="background:white; border-radius:40px 40px 0 0;">
      <h3 style="font-size:0.9rem; letter-spacing:3px; text-align:center; color:var(--text-muted); margin-bottom:40px; font-weight:800;">데이터 상세 분석</h3>
      ${MetricMeter("체질량지수(BMI)", state.bmi, std.bmi)}
      ${MetricMeter("골격근량(Muscle).kg", state.muscle, std.muscle)}
      ${MetricMeter("체지방률(Fat).%", state.bfr, std.bfr)}
      ${MetricMeter("내장지방(Visceral).Lv", state.visceral, std.visceral)}

      <button class="btn-luxury" style="margin-top:60px; width:100%;" onclick="window.setView('prescription')">맞춤형 정밀 처방 보기 <i class="fas fa-chevron-right"></i></button>
    </div>
  `
}

const PrescriptionView = () => {
  const typeName = AIEngine.classify(state)
  const type = TypeData[typeName]

  return `
    ${NavHeader('analysis')}
    <div class="prescription-dark reveal" style="min-height:100vh; margin-top:0; border-radius:0;">
      <div style="text-align:center; margin-bottom:50px;">
        <div class="type-badge" style="background:var(--brand-gold); color:var(--brand-primary); margin-bottom:20px;">SCENE 4: PRESCRIPTION</div>
        <h2 style="font-size:1.6rem; color:var(--brand-gold); font-weight:900;">분석 데이터 기반 PM 정밀 처방</h2>
        <p style="font-size:0.85rem; color:rgba(255,255,255,0.5); margin-top:12px;">수치 개선을 위한 전문가 추천 솔루션</p>
      </div>

      ${type.pm.map(name => `
        <div class="product-card-luxury">
          <span class="product-name-gold">${name}</span>
          <p style="font-size:0.9rem; color:rgba(255,255,255,0.7); line-height:1.7; margin-top:12px;">${ProductInfo[name]}</p>
        </div>
      `).join('')}

      <a href="https://horangpm.linkstory.co.kr" target="_blank" class="btn-luxury" style="margin-top:60px; font-size:1.1rem;">호랑피엠 공식몰에서 즉시 처방받기</a>
      
      <div style="margin-top:60px; padding:24px; background:rgba(255,255,255,0.05); border-radius:20px;">
        <p style="font-size:0.75rem; color:rgba(255,255,255,0.4); line-height:1.7; text-align:justify;">
          "본 분석 결과는 인바디 수치 기반의 영양 참고 정보입니다. 건강기능식품은 질병의 예방·치료를 목적으로 하지 않으며, 건강 이상이 의심될 경우 반드시 전문의 상담을 받으시길 권장합니다."
        </p>
      </div>
      
      <div style="text-align:center; margin-top:60px; font-size:0.8rem; color:rgba(255,255,255,0.3); letter-spacing:1px;">
        © 2025 Horang PM. All rights reserved.
      </div>
    </div>
  `
}

// -- Main Controls --

window.setView = (v) => { state.view = v; window.scrollTo(0,0); render() }
window.updateState = (k, v) => state[k] = isNaN(v) ? v : parseFloat(v)

window.handleOCR = async (input) => {
  if(!input.files[0]) return
  const f = document.querySelector('#scan-feedback'); f.style.display = 'flex'
  try {
    const r = await Tesseract.recognize(input.files[0], 'kor+eng')
    const t = r.data.text
    const weight = t.match(/(?:체중|Weight)\s*[:\s]*(\d+\.?\d*)/i)
    const muscle = t.match(/(?:골격근량|Muscle)\s*[:\s]*(\d+\.?\d*)/i)
    const bfr = t.match(/(?:체지방률|Fat)\s*[:\s]*(\d+\.?\d*)/i)
    const visceral = t.match(/(?:내장지방|Visceral)\s*[:\s]*(\d+)/i)
    const height = t.match(/(?:키|신장|Height)\s*[:\s]*(\d+\.?\d*)/i)
    const age = t.match(/(?:나이|연령|Age)\s*[:\s]*(\d+)/i)
    
    if(weight) state.weight = parseFloat(weight[1])
    if(muscle) state.muscle = parseFloat(muscle[1])
    if(bfr) state.bfr = parseFloat(bfr[1])
    if(visceral) state.visceral = parseInt(visceral[1])
    if(height) state.height = parseFloat(height[1])
    if(age) state.age = parseInt(age[1])
    render()
  } finally { f.style.display = 'none' }
}

window.startAnalysis = () => {
  const o = document.querySelector('#scan-overlay'); o.style.display = 'flex'
  setTimeout(() => { o.style.display = 'none'; window.setView('analysis') }, 2000)
}

const render = () => {
  if (state.view === 'splash') app.innerHTML = SplashView()
  else if (state.view === 'input') app.innerHTML = InputView()
  else if (state.view === 'analysis') app.innerHTML = AnalysisView()
  else if (state.view === 'prescription') app.innerHTML = PrescriptionView()
}

if(!document.querySelector('#scan-overlay')){
  document.body.insertAdjacentHTML('beforeend', `<div id="scan-overlay"><div class="laser"></div><div style="color:white; font-family:var(--font-montserrat); font-weight:900; margin-top:20px; letter-spacing:5px;">AI CLINICAL ANALYSIS</div></div>`)
}

render()
