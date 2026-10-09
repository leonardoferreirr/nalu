# Nalu Poke — v2

Site da Nalu Poke (poke com alma tropical). Scroll-driven, cor de fundo narrativa
por sabor, ingredientes fotorreais gerados por IA.

Stack: HTML + CSS + JS vanilla, zero dependências, fontes self-hosted.

## Onde mora o quê

**O CSS vive dentro do `index.html`, na tag `<style>`.** É ele que vai pro ar.
Existia também um `styles/main.css` que ninguém carregava e que estava atrás do
inline; foi removido para não enganar quem for editar. O JS continua em
`scripts/main.js`, carregado por `<script src>`.

## A onda

A fronteira entre seções é uma onda (`.wave-sep`, path `#nalu-wave`). Cada seção
pinta o próprio bloco com `--sec` e a onda do seu topo usa `--sec-prev`, a cor de
quem termina. O JS mantém as duas em `syncSectionColors()`, inclusive quando o
sabor ativo troca a cor da seção de sabores. A seção de avaliações tem a sua
própria onda animada, mais antiga, e por isso não recebe a estática.
