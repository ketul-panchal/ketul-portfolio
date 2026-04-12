import './ProtectedImage.css';

/**
 * Wraps an <img> with an invisible shield overlay.
 * Prevents: right-click → "Save image as", "Open image in new tab",
 *           dragging to desktop, long-press save on mobile.
 *
 * Usage:
 *   <ProtectedImage src="/photo.png" alt="..." className="my-img" />
 */
const ProtectedImage = ({ src, alt, className = '', style = {}, ...rest }) => {
  return (
    <div className={`protected-image-wrapper ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        className="protected-image"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        {...rest}
      />
      {/* Invisible shield — sits on top of the image */}
      <div className="protected-image-shield" />
    </div>
  );
};

export default ProtectedImage;
