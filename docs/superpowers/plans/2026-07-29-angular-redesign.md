# Jovens Empreendedores Angular Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static three-page site with a clean, accessible Angular application that preserves the current educational content and simulates a validated signup flow.

**Architecture:** Build a zoneless Angular 22 standalone application with three lazy-loaded route components, a shared application shell, typed page content, and Reactive Forms. Keep all behavior in the browser: the signup page validates local input, shows a short pending state, discards the values, and navigates to confirmation without a persistence service.

**Tech Stack:** Angular 22.0.x, Angular CLI 22.0.x, TypeScript 6.0.x, RxJS 7.8.x, Vitest through Angular CLI, HTML, CSS, Google Fonts loaded with `display=swap`.

## Global Constraints

- Use Node.js `^22.22.3`, `^24.15.0`, or `^26.0.0`, as required by Angular 22.
- Keep the name “Jovens Empreendedores” and preserve the meaning of every current text.
- Correct Portuguese spelling, encoding, punctuation, and presentation without inventing claims.
- Do not add a backend, API, database, analytics, authentication, email delivery, or browser persistence.
- Use Angular standalone APIs, strict TypeScript, zoneless change detection, lazy routes, and Reactive Forms.
- Use only local HTML, CSS, and SVG for the new identity; remove the old photographic and logo dependency.
- Meet WCAG AA contrast, visible focus, keyboard navigation, semantic heading order, and reduced-motion requirements.
- Support responsive layouts at 360 px, 768 px, 1024 px, and 1440 px widths.
- Do not claim that a real team received the simulated signup data.
- Do not show the user an intermediate layout; perform visual review and present the finished layout only after all verification passes.

## File Structure

```text
angular.json                         Angular build and test configuration
package.json                         Angular 22 dependencies and npm scripts
public/favicon.svg                   New local brand mark
src/index.html                       Document metadata and font preconnects
src/main.ts                          Application bootstrap
src/styles.css                       Tokens, reset, typography, utilities, focus and motion rules
src/app/app.ts                       Shared application shell
src/app/app.html                     Header, router outlet and footer composition
src/app/app.css                      Shell-only layout rules
src/app/app.config.ts                Router and zoneless providers
src/app/app.routes.ts                Lazy route table and redirects
src/app/app.routes.spec.ts           Route behavior tests
src/app/shared/site-header/          Responsive navigation component and tests
src/app/shared/site-footer/          Contact footer component and tests
src/app/home/home-content.ts         Typed landing-page copy and pillar data
src/app/home/home.ts                 Landing route behavior
src/app/home/home.html               Landing semantic structure
src/app/home/home.css                Landing layout and signature map
src/app/home/home.spec.ts            Landing content and navigation tests
src/app/signup/signup.ts             Reactive form, validation and simulated submit
src/app/signup/signup.html           Accessible signup form
src/app/signup/signup.css            Signup page layout and field states
src/app/signup/signup.spec.ts        Validation, focus and navigation tests
src/app/confirmation/confirmation.ts Confirmation route
src/app/confirmation/confirmation.html
src/app/confirmation/confirmation.css
src/app/confirmation/confirmation.spec.ts
```

---

### Task 1: Establish the Angular workspace and route contract

**Files:**
- Create: `angular.json`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.spec.json`
- Create: `src/index.html`
- Create: `src/main.ts`
- Create: `src/app/app.ts`
- Create: `src/app/app.html`
- Create: `src/app/app.css`
- Create: `src/app/app.config.ts`
- Create: `src/app/app.routes.ts`
- Create: `src/app/app.routes.spec.ts`
- Create: `src/app/home/home.ts`
- Create: `src/app/signup/signup.ts`
- Create: `src/app/confirmation/confirmation.ts`

**Interfaces:**
- Produces: `routes: Routes` with `/inicio`, `/inscricao`, `/confirmacao`, root redirect, and wildcard redirect.
- Produces: standalone placeholders `Home`, `Signup`, and `Confirmation`, later expanded without changing route imports.
- Produces: npm scripts `start`, `build`, `test`, and `test:ci`.

- [ ] **Step 1: Generate an Angular 22 scaffold without touching the existing pages**

Run:

```powershell
npx --yes @angular/cli@22 new jovens-empreendedores --directory .angular-scaffold --routing --style css --standalone --strict --test-runner vitest --zoneless --skip-git --skip-install --package-manager npm
Copy-Item '.angular-scaffold\angular.json','.\angular.json'
Copy-Item '.angular-scaffold\package.json','.\package.json'
Copy-Item '.angular-scaffold\tsconfig.json','.\tsconfig.json'
Copy-Item '.angular-scaffold\tsconfig.app.json','.\tsconfig.app.json'
Copy-Item '.angular-scaffold\tsconfig.spec.json','.\tsconfig.spec.json'
Copy-Item '.angular-scaffold\src' '.\src' -Recurse -Force
```

Edit `package.json` so the scripts are exactly:

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "test:ci": "ng test --watch=false"
  }
}
```

Run `npm install` and verify `npm exec ng version` reports Angular CLI and Angular `22.0.x`.

- [ ] **Step 2: Write the failing route tests**

Replace the generated root spec with `src/app/app.routes.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('application routes', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes)] }));

  it.each([
    ['/inicio', 'Educação financeira para todos'],
    ['/inscricao', 'Inscrição'],
    ['/confirmacao', 'Inscrição concluída'],
  ])('loads %s', async (url, heading) => {
    const harness = await RouterTestingHarness.create(url);
    expect(harness.routeNativeElement?.textContent).toContain(heading);
  });

  it.each(['/', '/endereco-inexistente'])('redirects %s to /inicio', async (url) => {
    const harness = await RouterTestingHarness.create(url);
    expect(harness.router.url).toBe('/inicio');
  });
});
```

- [ ] **Step 3: Run the route tests and verify failure**

Run: `npm run test:ci -- --include src/app/app.routes.spec.ts`

Expected: FAIL because the three lazy routes and their headings do not exist.

- [ ] **Step 4: Implement the minimal route shell**

Set `src/app/app.routes.ts` to:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./home/home').then(({ Home }) => Home),
  },
  {
    path: 'inscricao',
    loadComponent: () => import('./signup/signup').then(({ Signup }) => Signup),
  },
  {
    path: 'confirmacao',
    loadComponent: () =>
      import('./confirmation/confirmation').then(({ Confirmation }) => Confirmation),
  },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'inicio' },
];
```

Use this placeholder pattern for each route, changing class and heading:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<h1>Educação financeira para todos</h1>',
})
export class Home {}
```

Set `src/app/app.html` to `<router-outlet />` and keep `App` as the standalone root that imports `RouterOutlet`.

- [ ] **Step 5: Run route tests and production build**

Run: `npm run test:ci -- --include src/app/app.routes.spec.ts`

Expected: PASS, 5 tests.

Run: `npm run build`

Expected: PASS with output under `dist/`.

- [ ] **Step 6: Commit the workspace**

```powershell
git add angular.json package.json package-lock.json tsconfig*.json src
git commit -m "build: initialize Angular application"
```

---

### Task 2: Build the accessible shared shell

**Files:**
- Create: `public/favicon.svg`
- Create: `src/app/shared/site-header/site-header.ts`
- Create: `src/app/shared/site-header/site-header.html`
- Create: `src/app/shared/site-header/site-header.css`
- Create: `src/app/shared/site-header/site-header.spec.ts`
- Create: `src/app/shared/site-footer/site-footer.ts`
- Create: `src/app/shared/site-footer/site-footer.html`
- Create: `src/app/shared/site-footer/site-footer.css`
- Create: `src/app/shared/site-footer/site-footer.spec.ts`
- Modify: `src/app/app.ts`
- Modify: `src/app/app.html`
- Modify: `src/app/app.css`
- Modify: `src/index.html`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `SiteHeader` with `menuOpen: Signal<boolean>`, `toggleMenu()`, and `closeMenu()`.
- Produces: `SiteFooter` with the existing Instagram, email, and phone contact content.
- Consumes: router path `/inicio` and fragments `conteudo`, `sobre`, and `contato`.

- [ ] **Step 1: Write failing header and footer tests**

Create `site-header.spec.ts`:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
  });

  it('opens and closes the mobile menu', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.menu-toggle');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('exposes navigation to content, about and contact', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Conteúdo');
    expect(text).toContain('Quem somos');
    expect(text).toContain('Contato');
  });
});
```

Create `site-footer.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('renders the existing contact channels', async () => {
    await TestBed.configureTestingModule({ imports: [SiteFooter] }).compileComponents();
    const fixture = TestBed.createComponent(SiteFooter);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('financeir2@jovensemp.com.br');
    expect(fixture.nativeElement.textContent).toContain('(55) 31 99990-9999');
    expect(fixture.nativeElement.querySelector('a[href*="instagram.com"]')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the shell tests and verify failure**

Run: `npm run test:ci -- --include src/app/shared/**/*.spec.ts`

Expected: FAIL because `SiteHeader` and `SiteFooter` do not exist.

- [ ] **Step 3: Implement header behavior**

Use this behavior in `site-header.ts`:

```ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  @ViewChild('menuToggle', { read: ElementRef })
  private menuToggle?: ElementRef<HTMLButtonElement>;

  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus) queueMicrotask(() => this.menuToggle?.nativeElement.focus());
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeMenu(true);
  }
}
```

The template must include a skip link, a wordmark, an accessible toggle, and these exact links:

```html
<a class="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
<header class="site-header">
  <a class="brand" routerLink="/inicio" aria-label="Jovens Empreendedores — início">
    <span class="brand-mark" aria-hidden="true">JE</span>
    <span>Jovens<br />Empreendedores</span>
  </a>
  <button
    #menuToggle
    class="menu-toggle"
    type="button"
    aria-controls="site-navigation"
    [attr.aria-expanded]="menuOpen()"
    (click)="toggleMenu()"
  >
    <span class="sr-only">Abrir ou fechar menu</span>
    <span aria-hidden="true"></span>
  </button>
  <nav id="site-navigation" aria-label="Navegação principal" [class.is-open]="menuOpen()">
    <a routerLink="/inicio" fragment="conteudo" (click)="closeMenu()">Conteúdo</a>
    <a routerLink="/inicio" fragment="sobre" (click)="closeMenu()">Quem somos</a>
    <a routerLink="/inicio" fragment="contato" (click)="closeMenu()">Contato</a>
    <a class="button button--small" routerLink="/inscricao" (click)="closeMenu()">Quero aprender</a>
  </nav>
</header>
```

For the collapsed menu, use `visibility: hidden` and `pointer-events: none`; restore both in `.is-open` so hidden links cannot receive focus.

- [ ] **Step 4: Implement the footer and root composition**

Use semantic `<footer id="contato">`, keep the current contact copy, set the Instagram link to `target="_blank"` with `rel="noreferrer"`, and display the current year from:

```ts
readonly currentYear = new Date().getFullYear();
```

Set `app.html` to:

```html
<app-site-header />
<main id="conteudo-principal" tabindex="-1">
  <router-outlet />
</main>
<app-site-footer />
```

Import `SiteHeader`, `SiteFooter`, and `RouterOutlet` in `App`.

Add the Sora, Source Sans 3, and IBM Plex Mono font request to `src/index.html` with `display=swap`, and set `/favicon.svg` as the favicon.

- [ ] **Step 5: Add the global token contract**

Define these tokens in `src/styles.css`:

```css
:root {
  --paper: #f5f7fa;
  --ink: #122033;
  --blue: #2e5bff;
  --blue-dark: #1839b8;
  --green: #238b6d;
  --yellow: #f2c14e;
  --line: #dce3ec;
  --white: #ffffff;
  --danger: #b42318;
  --display: 'Sora', system-ui, sans-serif;
  --body: 'Source Sans 3', system-ui, sans-serif;
  --utility: 'IBM Plex Mono', ui-monospace, monospace;
  --content: 74rem;
  --radius-small: 0.5rem;
  --radius-large: 1.5rem;
  --shadow-focus: 0 0 0 0.25rem rgba(46, 91, 255, 0.22);
}
```

Add reset rules, `body` defaults, `.container`, `.button`, `.sr-only`, `.skip-link`, `:focus-visible`, and `@media (prefers-reduced-motion: reduce)` rules. Do not add decorative gradients.

- [ ] **Step 6: Run tests and commit**

Run: `npm run test:ci -- --include src/app/shared/**/*.spec.ts`

Expected: PASS, 3 tests.

Run: `npm run build`

Expected: PASS.

```powershell
git add public src
git commit -m "feat: add accessible application shell"
```

---

### Task 3: Implement the editorial home journey

**Files:**
- Create: `src/app/home/home-content.ts`
- Modify: `src/app/home/home.ts`
- Create: `src/app/home/home.html`
- Create: `src/app/home/home.css`
- Create: `src/app/home/home.spec.ts`

**Interfaces:**
- Produces: `Pillar` type `{ eyebrow: string; title: string; summary: string; topics: readonly string[] }`.
- Produces: `pillars: readonly Pillar[]` in the order Organizar, Proteger, Crescer.
- Produces: section fragments `conteudo` and `sobre`, consumed by the header.

- [ ] **Step 1: Write failing landing-page tests**

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }),
  );

  it('renders the proposition and three financial pillars', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Educação financeira para todos');
    expect([...element.querySelectorAll('.pillar h3')].map((node) => node.textContent?.trim()))
      .toEqual(['Organizar', 'Proteger', 'Crescer']);
  });

  it('keeps the existing mission and video', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('transmitir educação financeira para todos');
    expect(element.querySelector('iframe')?.getAttribute('src'))
      .toBe('https://www.youtube-nocookie.com/embed/HzRK6wTSHHU');
  });

  it('offers signup actions at the beginning and end', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('a[href="/inscricao"]').length).toBe(2);
  });
});
```

- [ ] **Step 2: Run the home tests and verify failure**

Run: `npm run test:ci -- --include src/app/home/home.spec.ts`

Expected: FAIL because the placeholder does not render pillars, mission, video, or actions.

- [ ] **Step 3: Add the typed content model**

In `home-content.ts`, define the three arrays with the current topics:

```ts
export interface Pillar {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly topics: readonly string[];
}

export const pillars: readonly Pillar[] = [
  {
    eyebrow: 'Comece pelo agora',
    title: 'Organizar',
    summary: 'Entenda para onde seu dinheiro vai e transforme intenção em um plano possível.',
    topics: [
      'A importância de investir em educação financeira',
      'Quebra de paradigmas ao falar sobre dinheiro',
      'Como criar consciência sobre o que gasta',
      'Como reduzir custos desnecessários',
    ],
  },
  {
    eyebrow: 'Construa segurança',
    title: 'Proteger',
    summary: 'Crie margem para imprevistos e dê um papel claro para cada parte da sua renda.',
    topics: [
      'Como estabelecer metas financeiras',
      'Como separar finanças pessoais e do negócio',
      'O que é reserva de emergência e por que ter uma',
      'Como organizar seus gastos em uma planilha',
      'A regra do ovo: como se organizar para ter 30% da renda sobrando',
    ],
  },
  {
    eyebrow: 'Prepare o futuro',
    title: 'Crescer',
    summary: 'Conheça caminhos para ampliar a renda e começar a investir com consciência.',
    topics: [
      'Como diversificar suas fontes de renda',
      'Introdução a investimentos',
      'Renda fixa',
      'Por que a poupança pode fazer você perder dinheiro',
      'Conceitos de taxas simples de juros',
      'Renda variável e o mercado de ações',
    ],
  },
];

export const practicalBenefits = [
  'Gestão eficiente do dinheiro',
  'Tomada de decisões informadas',
  'Controle sobre a dívida',
  'Construção de patrimônio',
  'Melhor capacidade de lidar com emergências financeiras',
  'Redução do estresse financeiro',
  'Planejamento para o futuro',
  'Aumento da segurança financeira',
  'Desenvolvimento de uma mentalidade de prosperidade',
  'Um estilo de vida mais leve',
] as const;
```

- [ ] **Step 4: Build the semantic page**

Import `RouterLink`, expose `pillars` and `practicalBenefits` as readonly properties, and create these sections in order:

```html
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow">Conhecimento para escolhas melhores</p>
      <h1 id="hero-title">Educação financeira para todos</h1>
      <p class="hero__lead">
        Conquiste liberdade financeira com nosso conteúdo gratuito sobre organização
        das finanças.
      </p>
      <a class="button" routerLink="/inscricao">Quero aprender</a>
    </div>
    <div class="decision-map" aria-label="Jornada: organizar, proteger e crescer">
      <span>Organizar</span><span>Proteger</span><span>Crescer</span>
      <svg aria-hidden="true" viewBox="0 0 520 180">
        <path class="decision-map__track" d="M24 142 C150 142 136 92 260 92 S370 38 496 38" />
        <circle cx="24" cy="142" r="8" />
        <circle cx="260" cy="92" r="8" />
        <circle cx="496" cy="38" r="8" />
      </svg>
    </div>
  </div>
</section>
```

Follow it with `#conteudo` pillars rendered using `@for`, a responsive video section using the privacy-enhanced YouTube URL, `#sobre` mission/vision copy, a benefits list rendered using `@for`, and a final signup section. Use one `h1`; use `h2` for sections and `h3` for pillar names.

- [ ] **Step 5: Style the signature without generic cards**

Implement the hero as a two-column editorial composition above 900 px and one column below it. Use the SVG line as the only orchestrated animation:

```css
.decision-map__track {
  fill: none;
  stroke: var(--blue);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 700;
  animation: draw-map 1.2s 180ms ease-out both;
}

@keyframes draw-map {
  from { stroke-dashoffset: 700; }
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .decision-map__track { animation: none; }
}
```

Use dividers and alternating alignment to structure the pillars. Do not place every topic inside an independent floating card.

- [ ] **Step 6: Run tests, build, and commit**

Run: `npm run test:ci -- --include src/app/home/home.spec.ts`

Expected: PASS, 3 tests.

Run: `npm run build`

Expected: PASS.

```powershell
git add src/app/home
git commit -m "feat: build financial education landing page"
```

---

### Task 4: Implement the validated local signup flow

**Files:**
- Modify: `src/app/signup/signup.ts`
- Create: `src/app/signup/signup.html`
- Create: `src/app/signup/signup.css`
- Create: `src/app/signup/signup.spec.ts`

**Interfaces:**
- Produces: `signupForm: FormGroup` with controls `name`, `email`, `phone`, and `income`.
- Produces: `submitting: Signal<boolean>`.
- Produces: `submit(): Promise<void>` that never persists values and navigates only after valid input.
- Consumes: Angular `Router.navigate(['/confirmacao'])`.

- [ ] **Step 1: Write failing form tests**

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Signup } from './signup';

describe('Signup', () => {
  let fixture: ComponentFixture<Signup>;
  let component: Signup;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('requires every field and focuses the first invalid control', async () => {
    const firstInput: HTMLInputElement = fixture.nativeElement.querySelector('#name');
    const focus = vi.spyOn(firstInput, 'focus');
    await component.submit();
    fixture.detectChanges();
    expect(component.signupForm.invalid).toBe(true);
    expect(focus).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Digite seu nome');
  });

  it('rejects malformed email and phone', () => {
    component.signupForm.patchValue({ email: 'email', phone: '123' });
    expect(component.signupForm.controls.email.hasError('email')).toBe(true);
    expect(component.signupForm.controls.phone.hasError('pattern')).toBe(true);
  });

  it('shows pending state, discards values and navigates after a valid submit', async () => {
    vi.useFakeTimers();
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.signupForm.setValue({
      name: 'Maria Silva',
      email: 'maria@example.com',
      phone: '(31) 99999-9999',
      income: 'ate-2004',
    });
    const submission = component.submit();
    expect(component.submitting()).toBe(true);
    await vi.advanceTimersByTimeAsync(650);
    await submission;
    expect(component.signupForm.value).toEqual({
      name: null, email: null, phone: null, income: null,
    });
    expect(navigate).toHaveBeenCalledWith(['/confirmacao']);
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run form tests and verify failure**

Run: `npm run test:ci -- --include src/app/signup/signup.spec.ts`

Expected: FAIL because the reactive form and submit behavior do not exist.

- [ ] **Step 3: Implement the reactive form**

Use:

```ts
private readonly formBuilder = inject(FormBuilder);
private readonly router = inject(Router);
readonly formElement = viewChild.required<ElementRef<HTMLFormElement>>('signupForm');

readonly submitting = signal(false);
readonly signupForm = this.formBuilder.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)]],
  income: ['', Validators.required],
});

async submit(): Promise<void> {
  if (this.submitting()) return;
  this.signupForm.markAllAsTouched();
  if (this.signupForm.invalid) {
    queueMicrotask(() =>
      this.formElement().nativeElement.querySelector<HTMLElement>('.ng-invalid')?.focus(),
    );
    return;
  }

  this.submitting.set(true);
  await new Promise<void>((resolve) => setTimeout(resolve, 650));
  this.signupForm.reset();
  await this.router.navigate(['/confirmacao']);
  this.submitting.set(false);
}
```

Import `FormBuilder`, `ReactiveFormsModule`, `Validators`, `Router`, `ElementRef`, `inject`, `signal`, and `viewChild`. The template form must declare `#signupForm`, `[formGroup]="signupForm"`, and `(ngSubmit)="submit()"`. Regular `FormBuilder` is intentional: `reset()` clears every value to `null`, matching the test and ensuring submitted values do not remain in memory.

- [ ] **Step 4: Build accessible form markup**

Use native labels, `autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"`, `aria-describedby`, and conditional errors with `@if`. Include these exact income values and labels:

```html
<option value="">Selecione</option>
<option value="ate-1254">Até R$ 1.254,00</option>
<option value="ate-2004">Até R$ 2.004,00</option>
<option value="ate-8640">Até R$ 8.640,00</option>
<option value="ate-11261">Até R$ 11.261,00</option>
<option value="acima-11262">Acima de R$ 11.262,00</option>
```

The button label must be `Enviando…` only while `submitting()` is true and `Enviar inscrição` otherwise. Add explanatory copy that the page is a demonstration and data is not stored.

- [ ] **Step 5: Style field, error, pending, and mobile states**

Use explicit borders and labels. Invalid controls must show both a danger border and a text message. Disabled state must remain readable. At widths below 640 px, the form occupies the available width with no fixed margins.

- [ ] **Step 6: Run tests, build, and commit**

Run: `npm run test:ci -- --include src/app/signup/signup.spec.ts`

Expected: PASS, 3 tests.

Run: `npm run build`

Expected: PASS.

```powershell
git add src/app/signup
git commit -m "feat: add local signup flow"
```

---

### Task 5: Complete confirmation, cleanup, and final visual verification

**Files:**
- Modify: `src/app/confirmation/confirmation.ts`
- Create: `src/app/confirmation/confirmation.html`
- Create: `src/app/confirmation/confirmation.css`
- Create: `src/app/confirmation/confirmation.spec.ts`
- Modify: `README.md` if generated
- Delete: `index.html`
- Delete: `page2.html`
- Delete: `page3.html`
- Delete: `css/styles.css`
- Delete: `js/script.js`
- Delete: `img/` and all unused legacy image assets
- Delete: `.angular-scaffold/`

**Interfaces:**
- Produces: a truthful confirmation route with a single `/inicio` action.
- Preserves: the Angular entry document at `src/index.html`; only the legacy root `index.html` is deleted.

- [ ] **Step 1: Write the failing confirmation test**

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Confirmation } from './confirmation';

describe('Confirmation', () => {
  it('confirms the simulation without claiming real delivery', async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmation],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Confirmation);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Inscrição concluída');
    expect(text).toContain('Esta demonstração não armazenou seus dados');
    expect(text).not.toContain('entraremos em contato');
    expect(fixture.nativeElement.querySelector('a[href="/inicio"]')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the confirmation test and verify failure**

Run: `npm run test:ci -- --include src/app/confirmation/confirmation.spec.ts`

Expected: FAIL because the placeholder does not contain truthful confirmation copy or the return action.

- [ ] **Step 3: Implement the confirmation route**

Use:

```html
<section class="confirmation" aria-labelledby="confirmation-title">
  <div class="confirmation__mark" aria-hidden="true">✓</div>
  <p class="eyebrow">Etapa concluída</p>
  <h1 id="confirmation-title">Inscrição concluída</h1>
  <p>
    Esta demonstração não armazenou seus dados. Você já pode voltar ao conteúdo
    e continuar sua jornada de educação financeira.
  </p>
  <a class="button" routerLink="/inicio">Voltar ao início</a>
</section>
```

Import `RouterLink`. Center the content within a readable measure, use green for the completion mark, and keep the shared header and footer visible.

- [ ] **Step 4: Run the complete automated suite**

Run: `npm run test:ci`

Expected: all route, shell, home, signup, and confirmation tests PASS.

Run: `npm run build`

Expected: PASS without TypeScript, template, style-budget, or accessibility-related template errors.

- [ ] **Step 5: Remove the replaced static implementation**

Before deletion, verify the exact paths are under `D:\Documents\site_pin`. Then remove only:

```text
D:\Documents\site_pin\index.html
D:\Documents\site_pin\page2.html
D:\Documents\site_pin\page3.html
D:\Documents\site_pin\css
D:\Documents\site_pin\js
D:\Documents\site_pin\img
D:\Documents\site_pin\.angular-scaffold
```

Do not remove `src/index.html`, `docs/`, `.git/`, Angular configuration, or source files. Run `npm run build` again after cleanup.

- [ ] **Step 6: Perform browser-based visual and interaction QA**

Start the local server at `http://127.0.0.1:4200`. Inspect `/inicio`, `/inscricao`, and `/confirmacao` at 360×800, 768×1024, 1024×768, and 1440×900.

Verify:

- no horizontal overflow or clipped text;
- hero hierarchy and decision map remain legible;
- only the map line has an orchestrated entrance;
- reduced-motion removes that animation;
- menu opens, closes, closes on `Esc`, and returns focus;
- all controls have visible keyboard focus;
- section links land on the intended content;
- YouTube frame maintains 16:9 proportion;
- error messages are adjacent to fields and not color-only;
- submit blocks duplicates and navigates after 650 ms;
- confirmation copy does not imply real delivery;
- the console has no Angular errors, missing assets, or failed internal requests.

Capture final desktop and mobile screenshots only after these checks pass. If a visual defect is found, fix the smallest responsible CSS or template unit, rerun the affected unit test and build, and repeat the screenshot.

- [ ] **Step 7: Update project instructions and commit**

Document these commands in `README.md`:

```markdown
## Desenvolvimento

- `npm install` — instala as dependências.
- `npm start` — inicia o servidor local.
- `npm run test:ci` — executa os testes uma vez.
- `npm run build` — gera o build de produção.

O formulário é demonstrativo: os dados não são enviados nem armazenados.
```

Run:

```powershell
git add -A
git commit -m "feat: complete Angular redesign"
git status --short
```

Expected: commit succeeds and `git status --short` prints no output.
