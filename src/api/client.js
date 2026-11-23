const STORAGE_KEY = 'ambiback.deviceBaseUrl'
const RECENT_DEVICES_KEY = 'ambiback.recentDevices'
const RECENT_MAX = 10
const CLAIM_KEYS_KEY = 'ambiback.claimKeys'
const PROTECTED_PARAMS = new Set([
  'setdeviceappass',
  'setdeviceapssid',
  'setwifiapenable',
  'setprovisioningenable',
  'setprovisioningtimeout',
  'setrelaytarget',
  'setrelaytodirect',
  'setrelaywifidirect',
  'setrelaymode',
  'setdebugsyslogserver',
  'setdebugsyslogport',
  'setdebugsyslog',
  'setdebugserial',
  'setdebugultra',
  'setwififail',
  'sethuebridgeip',
  'sethuebridgeuser',
  'sethuebridgeclientkey',
])

function readClaimKeys() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CLAIM_KEYS_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** Device key for the selected device, needed for protected actions on claimed devices. */
export function getClaimKey() {
  return readClaimKeys()[resolveBaseUrl()] || ''
}

export function setClaimKey(value) {
  const base = resolveBaseUrl()
  if (!base) return
  const keys = readClaimKeys()
  const trimmed = value.trim()
  if (trimmed) keys[base] = trimmed
  else delete keys[base]
  try {
    localStorage.setItem(CLAIM_KEYS_KEY, JSON.stringify(keys))
  } catch {
    // ignore
  }
}

function withClaimKey(path) {
  const key = getClaimKey()
  if (!key) return path
  return `${path}${path.includes('?') ? '&' : '?'}claimkey=${encodeURIComponent(key)}`
}

export function getStoredBaseUrl() {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setStoredBaseUrl(value) {
  localStorage.setItem(STORAGE_KEY, value)
}

export function getRecentDevices() {
  try {
    const raw = localStorage.getItem(RECENT_DEVICES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addRecentDevice(url) {
  if (!url) return
  const normalized = normalizeBaseUrl(url)
  if (!normalized) return
  const recent = getRecentDevices().filter((u) => u !== normalized)
  recent.unshift(normalized)
  const trimmed = recent.slice(0, RECENT_MAX)
  try {
    localStorage.setItem(RECENT_DEVICES_KEY, JSON.stringify(trimmed))
  } catch {
    // ignore
  }
}

export function resolveBaseUrl() {
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('device')
  if (fromQuery) {
    return normalizeBaseUrl(fromQuery)
  }
  const stored = getStoredBaseUrl()
  return normalizeBaseUrl(stored)
}

export function normalizeBaseUrl(value) {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '')
  }
  return `http://${trimmed}`.replace(/\/+$/, '')
}

async function requestJson(path) {
  const url = buildUrl(path)
  const response = await fetch(url, { mode: 'cors' })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

async function requestText(path) {
  const url = buildUrl(path)
  const response = await fetch(url, { mode: 'cors' })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

function buildUrl(path) {
  const base = resolveBaseUrl()
  if (!base) return path
  if (path.startsWith('/')) {
    return `${base}${path}`
  }
  return `${base}/${path}`
}

export const api = {
  getStatus: () => requestJson('/getstatusasjson'),
  getParams: () => requestJson('/getparamatersasjson'),
  getLastStatusMessage: () => requestJson('/getlaststatusmessageasjson'),
  scanWifi: () => requestJson('/getscannetworksasjson'),
  setColorMode: (mode) => requestText(`/setcolormode?mode=${encodeURIComponent(mode)}`),
  setColor: (hex) => requestText(`/setcolor?color=${encodeURIComponent(hex)}`),
  setParam: (param, value) => {
    const path = `/setparam?param=${encodeURIComponent(param)}&value=${encodeURIComponent(value)}`
    return requestText(PROTECTED_PARAMS.has(param) ? withClaimKey(path) : path)
  },
  setPreset: (param, value) =>
    requestText(`/setpreset?param=${encodeURIComponent(param)}&value=${encodeURIComponent(value)}`),
  refreshHueDevices: () => requestText('/refresh_hue_devices'),
  getHueLightSettings: (id) =>
    requestText(`/controllersettings_hue.js?id=${encodeURIComponent(id)}`),
  setHueLightParam: ({ param, id, value, zone }) =>
    requestText(
      `/setparam?param=${encodeURIComponent(param)}&id=${encodeURIComponent(id)}&value=${encodeURIComponent(value)}${
        zone !== undefined ? `&zone=${encodeURIComponent(zone)}` : ''
      }`,
    ),
  refreshDreamscreenDevices: () => requestText('/refresh_dreamscreen_devices'),
  addDreamscreenToNetwork: (ssid) =>
    requestText(`/dreamscreenaddtonetwork?value=${encodeURIComponent(ssid)}`),
  setCameraPoint: (point, left, top) =>
    requestText(
      `/setcamerapoint?point=${encodeURIComponent(point)}&left=${encodeURIComponent(left)}&top=${encodeURIComponent(top)}`,
    ),
  reboot: () => requestText(withClaimKey('/reboot?forreal=1')),
  startWps: () => requestText(withClaimKey('/startwps?forreal=1')),
  updateUrl: () => buildUrl('/update'),

  /** Fetch firmware index via device proxy (like old embedded UI). Device fetches from firmware server. */
  getFirmwareIndex: () => requestJson('/getfirmwareindex'),

  /** Trigger automatic OTA update. version format: "0.4.226" */
  autoUpdate: (version) => requestJson(withClaimKey(`/autoupdate?version=${encodeURIComponent(version)}`)),

  /** Poll update status during OTA */
  updateStatus: () => requestJson('/updatestatus'),

  /** Phase 3: GET /discover from known device - returns UDP-discovered devices */
  async discoverViaEndpoint() {
    const base = resolveBaseUrl()
    if (!base) throw new Error('No device URL set')
    const url = `${base.replace(/\/+$/, '')}/discover`
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  },

  /** Phase 2: Subnet scan - fetch status from each IP */
  discoverDevices: async (subnet, signal) => {
    const { scanSubnet } = await import('../utils/discovery.js')
    return scanSubnet(subnet, signal)
  },
}
