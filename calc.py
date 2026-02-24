import math
cx = 200
cy = 200
r = 120
angles = [-math.pi/2 + i * 2 * math.pi / 5 for i in range(5)]
out = ""

# axes
for i, a in enumerate(angles):
    out += f'<line x1=\"{cx}\" y1=\"{cy}\" x2=\"{cx + r * math.cos(a):.1f}\" y2=\"{cy + r * math.sin(a):.1f}\" stroke=\"#334155\" stroke-width=\"1\" />\n'

# grids (20, 40, 60, 80, 100)
for g in [0.2, 0.4, 0.6, 0.8, 1.0]:
    pts = []
    for a in angles:
        pts.append(f'{cx + r * g * math.cos(a):.1f},{cy + r * g * math.sin(a):.1f}')
    out += f'<polygon points=\"{" ".join(pts)}\" fill=\"none\" stroke=\"#334155\" stroke-width=\"1\" />\n'

# peDireito: 95, 100, 90, 90, 95
pe = [0.95, 1.0, 0.9, 0.9, 0.95]
pts = []
for i, a in enumerate(angles):
    pts.append(f'{cx + r * pe[i] * math.cos(a):.1f},{cy + r * pe[i] * math.sin(a):.1f}')
out += f'<polygon points=\"{" ".join(pts)}\" fill=\"#22c55e\" fill-opacity=\"0.5\" stroke=\"#22c55e\" stroke-width=\"3\" />\n'

# tradicional: 30, 20, 40, 50, 40
tr = [0.3, 0.2, 0.4, 0.5, 0.4]
pts = []
for i, a in enumerate(angles):
    pts.append(f'{cx + r * tr[i] * math.cos(a):.1f},{cy + r * tr[i] * math.sin(a):.1f}')
out += f'<polygon points=\"{" ".join(pts)}\" fill=\"#64748b\" fill-opacity=\"0.2\" stroke=\"#94a3b8\" stroke-width=\"2\" stroke-dasharray=\"4 4\" />\n'

# labels
labels = ['Onipresença Logística (Aérea)', 'Inteligência e Dados', 'Força de Conversão (Rua)', 'Alcance Digital', 'Eficiência Financeira']
offsets = [(0, -15), (25, 5), (0, 20), (0, 20), (-25, 5)]
for i, a in enumerate(angles):
    lx = cx + (r + 15) * math.cos(a) + offsets[i][0]
    ly = cy + (r + 15) * math.sin(a) + offsets[i][1]
    anchor = 'middle'
    if lx > cx + 30: anchor = 'start'
    if lx < cx - 30: anchor = 'end'
    if i == 0: anchor = 'middle'
    out += f'<text x=\"{lx:.1f}\" y=\"{ly:.1f}\" text-anchor=\"{anchor}\" fill=\"#cbd5e1\" font-size=\"12\" font-weight=\"600\" font-family=\"Inter, sans-serif\">{labels[i]}</text>\n'

with open('svg.txt', 'w', encoding='utf-8') as f:
    f.write(out)
