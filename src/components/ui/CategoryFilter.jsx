import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function CategoryFilter({ categories = [], value, onChange }) {
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(e, newValue) => newValue && onChange(newValue)}
            size="small"
            sx={{
                '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 2,
                    py: 0.75,
                    border: '1px solid #E0E0E0',
                    '&.Mui-selected': {
                        bgcolor: '#F3F4F6',
                        color: '#111827',
                        fontWeight: 700,
                        '&:hover': {
                            bgcolor: '#E5E7EB',
                        },
                    },
                },
            }}
        >
            {categories.map((cat) => (
                <ToggleButton key={cat} value={cat}>
                    {cat}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
