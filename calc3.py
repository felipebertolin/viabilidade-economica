import math
# We make the container wider and the radius smaller (equivalent to outerRadius=65%, margin left/right=100)
# Container 600x400
w = 600
h = 400
cx = w / 2
cy = h / 2
r = 110 # even smaller radius to give huge margins for text

angles = [-math.pi/2 + i * 2 * math.pi / 5 for i in range(5)]
out = ""

for i, a in enumerate(angles):
    out += f'<line x1="{cx}" y1="{cy}" x2="{cx + r * math.cos(a):.1f}" y2="{cy + r * math.sin(a):.1f}" stroke="#334155" stroke-width="1" />\n'

for g in [0.2, 0.4, 0.6, 0.8, 1.0]:
    pts = []
    for a in angles:
        pts.append(f'{cx + r * g * math.cos(a):.1f},{cy + r * g * math.sin(a):.1f}')
    out += f'<polygon points="{" ".join(pts)}" fill="none" stroke="#334155" stroke-width="1" />\n'

tr = [0.3, 0.2, 0.4, 0.5, 0.4]
pts = []
for i, a in enumerate(angles):
    pts.append(f'{cx + r * tr[i] * math.cos(a):.1f},{cy + r * tr[i] * math.sin(a):.1f}')
out += f'<polygon points="{" ".join(pts)}" fill="#8b5cf6" fill-opacity="0.4" stroke="#8b5cf6" stroke-width="2" style="transition: opacity 0.3s;"/>\n'

pe = [0.95, 1.0, 0.9, 0.9, 0.95]
pts = []
for i, a in enumerate(angles):
    pts.append(f'{cx + r * pe[i] * math.cos(a):.1f},{cy + r * pe[i] * math.sin(a):.1f}')
out += f'<polygon points="{" ".join(pts)}" fill="#22c55e" fill-opacity="0.5" stroke="#22c55e" stroke-width="3" style="filter: drop-shadow(0 0 10px rgba(34,197,94,0.5)); transition: opacity 0.3s;" />\n'

labels = ['Onipresença Logística (Aérea)', 'Inteligência e Dados', 'Força de Conversão (Rua)', 'Alcance Digital', 'Eficiência Financeira']
offsets = [(0, -25), (40, 5), (0, 30), (0, 30), (-40, 5)]
for i, a in enumerate(angles):
    lx = cx + (r + 15) * math.cos(a) + offsets[i][0]
    ly = cy + (r + 15) * math.sin(a) + offsets[i][1]
    anchor = 'middle'
    if lx > cx + 30: anchor = 'start'
    if lx < cx - 30: anchor = 'end'
    if i == 0: anchor = 'middle'
    
    out += f'<g class="radar-interactive-group" data-idx="{i}" style="cursor: pointer; pointer-events: all; transition: transform 0.2s;">\n'
    out += f'  <text x="{lx:.1f}" y="{ly:.1f}" text-anchor="{anchor}" fill="#cbd5e1" font-size="12" font-weight="600" font-family="Inter, sans-serif" class="radar-label" style="pointer-events: none;">{labels[i]}</text>\n'
    out += f'  <circle cx="{cx + r * math.cos(a):.1f}" cy="{cy + r * math.sin(a):.1f}" r="40" fill="transparent" />\n'
    out += f'</g>\n'

with open('svg3.txt', 'w', encoding='utf-8') as f:
    f.write(out)
