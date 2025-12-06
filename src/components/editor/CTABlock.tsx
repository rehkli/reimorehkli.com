interface CTABlockProps {
  value: {
    heading_est: string;
    heading_eng: string;
    text_est: string;
    text_eng: string;
    button_label_est: string;
    button_label_eng: string;
    button_link: string;
    bg_color: string;
  };
  onChange: (value: any) => void;
}

export default function CTABlock({ value, onChange }: CTABlockProps) {
  const colorOptions = [
    { name: 'Mint', value: '#C8F3E6' },
    { name: 'Lemon', value: '#FFF59D' },
    { name: 'Pink Light', value: '#FFE5F1' },
    { name: 'Purple Light', value: '#E6D5F5' },
    { name: 'Teal', value: '#2C6E6B' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-teal font-bold mb-2">Heading (EST)</label>
          <input
            type="text"
            value={value.heading_est}
            onChange={(e) => onChange({ ...value, heading_est: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
            placeholder="Call to action heading"
          />
        </div>
        <div>
          <label className="block text-teal font-bold mb-2">Heading (ENG)</label>
          <input
            type="text"
            value={value.heading_eng}
            onChange={(e) => onChange({ ...value, heading_eng: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
            placeholder="Call to action heading"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-teal font-bold mb-2">Text (EST)</label>
          <textarea
            value={value.text_est}
            onChange={(e) => onChange({ ...value, text_est: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
            placeholder="Supporting text"
          />
        </div>
        <div>
          <label className="block text-teal font-bold mb-2">Text (ENG)</label>
          <textarea
            value={value.text_eng}
            onChange={(e) => onChange({ ...value, text_eng: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
            placeholder="Supporting text"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-teal font-bold mb-2">Button Label (EST)</label>
          <input
            type="text"
            value={value.button_label_est}
            onChange={(e) => onChange({ ...value, button_label_est: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
            placeholder="Button text"
          />
        </div>
        <div>
          <label className="block text-teal font-bold mb-2">Button Label (ENG)</label>
          <input
            type="text"
            value={value.button_label_eng}
            onChange={(e) => onChange({ ...value, button_label_eng: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
            placeholder="Button text"
          />
        </div>
      </div>

      <div>
        <label className="block text-teal font-bold mb-2">Button Link</label>
        <input
          type="text"
          value={value.button_link}
          onChange={(e) => onChange({ ...value, button_link: e.target.value })}
          className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
          placeholder="/contact or https://example.com"
        />
      </div>

      <div>
        <label className="block text-teal font-bold mb-2">Background Color</label>
        <div className="flex gap-2 flex-wrap">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange({ ...value, bg_color: color.value })}
              className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${
                value.bg_color === color.value
                  ? 'border-teal ring-2 ring-teal'
                  : 'border-gray-300 hover:border-teal'
              }`}
              style={{ backgroundColor: color.value }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-2 border-teal rounded-2xl p-6 mt-4" style={{ backgroundColor: value.bg_color }}>
        <h3 className="text-2xl font-black text-teal mb-2">
          {value.heading_est || 'Preview Heading'}
        </h3>
        <p className="text-teal font-semibold mb-4">
          {value.text_est || 'Preview text will appear here'}
        </p>
        <button className="bg-lemon text-teal px-6 py-2 rounded-full font-black border-2 border-teal">
          {value.button_label_est || 'Button'}
        </button>
      </div>
    </div>
  );
}
