import React from 'react';
import { BakeryItem } from './bakeryItems';

interface BakeMetadataProps {
  item: BakeryItem;
}

export default function BakeMetadata({ item }: BakeMetadataProps) {
  return (
    <div className="w-full text-left space-y-[14px]">
      {/* Baked Date & Occasion */}
      <div className="grid grid-cols-2 gap-[16px] border-b border-[#ebe8e4] pb-[12px]">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.16em] text-[#a59f97] mb-[2px] font-[500]">
            BAKED
          </span>
          <span className="text-[13px] font-[500] text-[#000000]">{item.bakedDate}</span>
          {item.madeAtTime && (
            <span className="block text-[11px] text-[#777169] mt-[1px]">{item.madeAtTime}</span>
          )}
        </div>

        <div>
          <span className="block text-[10px] uppercase tracking-[0.16em] text-[#a59f97] mb-[2px] font-[500]">
            OCCASION
          </span>
          <span className="text-[13px] font-[500] text-[#000000] leading-tight block">
            {item.occasion || 'Spontaneous bake'}
          </span>
          {item.madeFor && (
            <span className="block text-[11px] text-[#777169] truncate mt-[1px]">for {item.madeFor}</span>
          )}
        </div>
      </div>

      {/* Honest Kitchen Note (Google Font Mynerve per user request) */}
      {item.kitchenNote && (
        <div className="border-b border-[#ebe8e4] pb-[12px]">
          <span className="block text-[10px] uppercase tracking-[0.16em] text-[#a59f97] mb-[4px] font-[500]">
            KITCHEN NOTE
          </span>
          <p className="font-mynerve text-[17px] sm:text-[19px] text-[#000000] leading-snug tracking-wide">
            "{item.kitchenNote}"
          </p>
        </div>
      )}

      {/* Verdict & Would Make Again */}
      <div className="flex items-center justify-between gap-[24px] border-b border-[#ebe8e4] pb-[12px]">
        <div className="flex-1 min-w-0">
          <span className="block text-[10px] uppercase tracking-[0.16em] text-[#a59f97] mb-[2px] font-[500]">
            VERDICT
          </span>
          <span className="block text-[13px] font-[500] text-[#000000] leading-snug">
            {item.verdict}
          </span>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#f5f3f1] border border-[#ebe8e4] px-[10px] py-[3px] text-[11px] text-[#44403b] font-[500]">
            {item.wouldMakeAgain ? 'Make again ✓' : 'One-time experiment'}
          </span>
        </div>
      </div>

      {/* Humorous Imperfection Stats */}
      {item.funnyStats && item.funnyStats.length > 0 && (
        <div className="space-y-[6px] pt-[2px]">
          {item.funnyStats.map((stat, i) => (
            <div key={i} className="flex justify-between items-center text-[11px]">
              <span className="text-[#777169] uppercase tracking-wider">{stat.label}</span>
              <span className="font-[500] text-[#000000]">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
