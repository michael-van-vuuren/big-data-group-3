"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

  interface ColorPickerProps {
    onChange: (color: string) => void;
  }

  export default function ColorPicker({ onChange }: ColorPickerProps) {
    return (
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-[180px] dark:text-black">
          <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="#f43f5e">Red</SelectItem>
            <SelectItem value="#0d9488">Green</SelectItem>
            <SelectItem value="#3b82f6">Blue</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
