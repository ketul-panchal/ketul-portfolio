import './ProtectedImage.css';

/**
 * Wraps an <img> with an invisible shield overlay.
 * Prevents: right-click → "Save image as", "Open image in new tab",
 *           dragging to desktop, long-press save on mobile.
 *
 * Any extra props (srcSet, sizes, width, height, loading, decoding,
 * fetchPriority…) are forwarded to the <img>, so callers can hand the browser
 * everything it needs to size and schedule the decode up front.
 *
 * Usage:
 *   <ProtectedImage src="/photo.png" alt="..." className="my-img" />
 */
const ProtectedImage = ({
  src,
  alt,
  className = '',
  style = {},
  imgClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) => {
  return (
    <div className={`protected-image-wrapper ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        className={`protected-image ${imgClassName}`.trim()}
        draggable={false}
        loading={loading}
        decoding={decoding}
        onContextMenu={(e) => e.preventDefault()}
        {...rest}
      />
      {/* Invisible shield — sits on top of the image */}
      <div className="protected-image-shield" />
    </div>
  );
};

export default ProtectedImage;
