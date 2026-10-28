import React from 'react';
import clsx from 'clsx';
import styles from './SegmentedControl.module.css';

type SegmentedControlProps<Value extends string> = {
    /** Read out by screen readers for the whole group. */
    label: string;
    options: readonly { value: Value; label: string }[];
    value: Value;
    onChange: (value: Value) => void;
};

/** A row of mutually exclusive buttons; the chosen one is marked with aria-pressed. */
export default function SegmentedControl<Value extends string>(
    {label, options, value, onChange}: SegmentedControlProps<Value>,
) {
    return (
        <div className={styles.group} role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={clsx(styles.option, option.value === value && styles.selected)}
                    aria-pressed={option.value === value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
