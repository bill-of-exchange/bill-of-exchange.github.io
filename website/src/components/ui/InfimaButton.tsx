// src/components/ui/InfimaButton.tsx
import React from 'react';

type Variant = 'primary' | 'secondary' |'success' | 'outline' | 'link' | 'danger' ;
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
    primary: 'button button--primary',
    secondary: 'button button--secondary',
    success: 'button button--success',
    outline: 'button button--outline',
    link: 'button button--link',
    danger: 'button button--danger',
};

const sizeClass: Record<Size, string> = {
    sm: 'button--sm',
    md: '',
    lg: 'button--lg',
};

export function InfimaButton({
                                 children,
                                 variant = 'primary',
                                 size = 'md',
                                 loading = false,
                                 className = '',
                                 disabled: disabledProp,
                                 title, // title intended for tooltip
                                 ...rest
                             }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant; size?: Size; loading?: boolean;
}) {
    const disabled = loading || !!disabledProp;
    const btn = (
        <button
            className={`${variantClass[variant]} ${sizeClass[size]} ${className}`}
            disabled={disabled}
            aria-disabled={disabled}
            {...rest} // 'disabled' isn't in rest anymore, so can't overwrite
        >
            {loading && <span className="button__spinner" aria-hidden style={{ marginRight: 6 }} />}
            {children}
        </button>
    );

    // Only wrap when we actually need a tooltip while disabled
    return disabled && title
        ? <span title={title} style={{ display: 'inline-block' }}>{btn}</span>
        : btn;
}


// export function InfimaButton({
//                            children,
//                            variant = 'primary',
//                            size = 'md',
//                            loading = false,
//                            className = '',
//                            ...props
//                        }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
//     return (
//         <button
//             className={`${variantClass[variant]} ${sizeClass[size]} ${className}`}
//             disabled={loading || props.disabled}
//             {...props}
//         >
//             {loading && <span className="button__spinner" aria-hidden style={{ marginRight: 6 }} />}
//             {children}
//         </button>
//     );
// }
