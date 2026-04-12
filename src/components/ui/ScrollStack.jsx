import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '', style = {} }) => (
    <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
        {children}
    </div>
);

const ScrollStack = ({ children, className = '' }) => {
    return (
        <div className={`scroll-stack-container ${className}`.trim()}>
            {children}
        </div>
    );
};

export default ScrollStack;
