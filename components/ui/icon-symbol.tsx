// Web-compatible icon component using Unicode/emoji symbols
// Replaces MaterialIcons (which requires a font file) with inline text/emoji
// This ensures icons display correctly on all platforms without font loading issues

import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { OpaqueColorValue, Text, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName = SymbolViewProps["name"];

/**
 * Mapping from SF Symbol names to Unicode/emoji characters.
 * These render without any external font files.
 */
const EMOJI_MAPPING: Record<string, string> = {
  // Navigation
  "house.fill": "🏠",
  "list.bullet.clipboard.fill": "📋",
  "book.fill": "📖",
  "briefcase.fill": "💼",
  "person.fill": "👤",
  // Actions
  "paperplane.fill": "✉️",
  "chevron.left.forwardslash.chevron.right": "</>",
  "chevron.right": "›",
  "chevron.left": "‹",
  "chevron.down": "▾",
  "chevron.up": "▴",
  "xmark": "✕",
  "xmark.circle.fill": "✕",
  "checkmark": "✓",
  "checkmark.circle.fill": "✅",
  "checkmark.circle": "○",
  "checkmark.rectangle.fill": "☑",
  "checkmark.seal.fill": "✅",
  "circle": "○",
  "circle.fill": "●",
  // Content
  "doc.text.fill": "📄",
  "doc.fill": "📄",
  "doc.badge.plus": "📝",
  "doc.on.doc.fill": "📑",
  "doc.on.clipboard": "📋",
  "doc.plaintext.fill": "📃",
  "folder.fill": "📁",
  "magnifyingglass": "🔍",
  "info.circle.fill": "ℹ️",
  "info.circle": "ℹ",
  "exclamationmark.triangle.fill": "⚠️",
  "star.fill": "⭐",
  "star": "☆",
  "heart.fill": "❤️",
  "arrow.right": "→",
  "arrow.left": "←",
  "arrow.up.right": "↗",
  "arrow.up.right.square": "↗",
  "arrow.up.right.circle.fill": "↗",
  "arrow.clockwise": "↻",
  "arrow.counterclockwise": "↺",
  "arrow.triangle.branch": "⑂",
  "plus": "+",
  "plus.circle.fill": "⊕",
  "minus": "−",
  "minus.circle.fill": "⊖",
  "trash.fill": "🗑",
  "pencil": "✏️",
  "link": "🔗",
  "externaldrive.fill": "💾",
  "clock.fill": "🕐",
  "calendar": "📅",
  "bell.fill": "🔔",
  "gear": "⚙️",
  "gearshape.fill": "⚙️",
  "lock.fill": "🔒",
  "lock.open.fill": "🔓",
  "shield.fill": "🛡",
  "building.2.fill": "🏢",
  "building.fill": "🏢",
  "building.columns.fill": "🏛",
  "person.3.fill": "👥",
  "person.badge.plus": "👤",
  "creditcard.fill": "💳",
  "chart.bar.fill": "📊",
  "chart.line.uptrend.xyaxis": "📈",
  "chart.gantt": "📊",
  "questionmark.circle.fill": "❓",
  "phone.fill": "📞",
  "envelope.fill": "✉️",
  "lightbulb.fill": "💡",
  "banknote.fill": "💰",
  "tag.fill": "🏷",
  "flag.fill": "🚩",
  "globe": "🌐",
  "wand.and.stars": "✨",
  "sparkles": "✨",
  "brain": "🧠",
  "text.quote": "❝",
  "cart.fill": "🛒",
  "target": "🎯",
  "scale.3d": "⚖",
  "text.badge.checkmark": "✓",
  "square.and.arrow.up": "↑",
  "square.and.pencil": "✏️",
  "eurosign.circle.fill": "€",
  "eye.fill": "👁",
  "eye.slash.fill": "🚫",
  "list.bullet": "☰",
};

/**
 * An icon component that uses Unicode/emoji characters for cross-platform compatibility.
 * Works on iOS, Android, and web without requiring external font files.
 * Icon `name`s are based on SF Symbols naming convention.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const emoji = EMOJI_MAPPING[name as string] ?? "•";
  return (
    <Text
      style={[
        {
          fontSize: size * 0.85,
          color: color as string,
          lineHeight: size,
          textAlign: "center",
          width: size,
          height: size,
        },
        style,
      ]}
    >
      {emoji}
    </Text>
  );
}
