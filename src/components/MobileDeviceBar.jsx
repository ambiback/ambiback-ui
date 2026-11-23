import useDevice from '../hooks/useDevice.js'
import { useDeviceParamsContext } from '../contexts/DeviceParamsContext.jsx'

export default function MobileDeviceBar({ onOpenMenu }) {
  const { baseUrl } = useDevice()
  const { params, loading, error } = useDeviceParamsContext()

  const trimmedBaseUrl = baseUrl.replace(/^https?:\/\//, '')
  const deviceName = params?.devicename || params?.deviceip || 'No device selected'
  const deviceAddress = params?.deviceip || trimmedBaseUrl || 'Enter a device IP'
  const connectionState = loading ? 'Connecting' : error ? 'Offline' : params ? 'Connected' : 'Not connected'
  const statusClass = loading ? 'loading' : error ? 'error' : params ? 'ok' : 'error'

  return (
    <section className="mobile-device-bar" aria-label="Connected device">
      <div className="mobile-device-bar-main">
        <span className={`device-status-dot ${statusClass}`} aria-hidden />
        <div className="mobile-device-bar-copy">
          <div className="mobile-device-bar-title">{deviceName}</div>
          <div className="mobile-device-bar-meta">
            <span>{deviceAddress}</span>
            <span className="mobile-device-bar-separator" aria-hidden>
              •
            </span>
            <span>{connectionState}</span>
          </div>
        </div>
      </div>
      <button type="button" className="button secondary mobile-device-bar-action" onClick={onOpenMenu}>
        Change device
      </button>
    </section>
  )
}
