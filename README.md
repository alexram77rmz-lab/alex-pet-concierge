# ALEX PET CONCIERGE — Quiet Luxury Landing Page & Web App

Aplicación web y Landing Page orientada a conversión para **Alex Pet Concierge** (paseos privados 1 a 1 para perros y cuidado a domicilio *Cat & Home Sitting* para gatos y perros).

## Stack Técnico
- **Framework:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS (`#FAF9F6` Hueso Cálido, `#18181B` Carbón Profundo, `#1E3A2F` Verde Bosque, `#E5E0D8` Beige Piedra) + Modo Nocturno Editorial
- **Iconografía:** `lucide-react`
- **Animaciones:** `framer-motion`
- **UX Mobile-First:** Todos los botones, selectores, sliders y acordeones tienen una altura táctil mínima de `44px` (`min-h-[44px]` a `min-h-[54px]`).

## Reglas de Negocio (Calculadora de Tarifas)
- **Tarifa Base:** `$200 MXN` por hora / sesión.
- **1 hora / sesión individual:** `0%` de descuento (`$200 MXN/hr`, Total `$200 MXN`). Etiqueta activa: *"Tarifa estándar por sesión única (descuentos aplican a partir de paquetes)"*.
- **2 a 4 horas / sesiones:** `5%` de descuento automático (`$190 MXN/hr`, Total de `$380` a `$760 MXN`).
- **5 a 10 horas / sesiones:** `10%` de descuento automático (`$180 MXN/hr`, Total de `$900` a `$1,800 MXN`). Badge destacado: *"Máximo Ahorro • Cliente Frecuente"*.

## Ejecución Local
```bash
npm.cmd install
npm.cmd run dev
```
Para compilar a producción:
```bash
npm.cmd run build
```
