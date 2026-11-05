const projects = {
  'fintech-app': {
    repository: 'https://github.com/Rishabh2815/rakshagrid',
    number: '01', title: 'RakshaGrid', type: 'Verified hyperlocal SOS dispatch · Aug 2026 — Present · In progress',
    period: 'Aug 2026 — Present · In progress', stack: 'Go · Redis GEO · PostgreSQL · Docker · WebSockets',
    overview: 'A campus safety project using verified records, Redis geospatial lookups, and real-time responder status to match an SOS to a nearby available responder. Matching is targeting sub-second dispatch; the project remains in progress.',
    sections: [
      ['What it is', 'A campus-focused emergency response project. Its planned experience connects a person raising an SOS with nearby verified responders.'],
      ['The problem', 'Emergency response can lose time when a centralized contact path or unreliable connectivity is a barrier.'],
      ['The solution', 'The project explores offline-first SOS delivery and real-time responder coordination.'],
    ]
  },
  popcorn: {
    repository: 'https://github.com/Rishabh2815/Sentinel',
    number: '02', title: 'Sentinel', type: 'ML-assisted API gateway · November 2025',
    period: 'November 2025', stack: 'Go · Redis · FastAPI · scikit-learn · Docker · Prometheus · Grafana · k6',
    overview: 'A Go reverse-proxy gateway combines Redis-backed atomic sliding-window rate limits with a FastAPI/scikit-learn bot scorer. A hard 150 ms fail-open scorer timeout preserves gateway availability when the ML service is down.',
    sections: [
      ['What it is', 'A gateway that rate-limits requests, checks a bot-likelihood score, and routes allowed traffic to a backend.'],
      ['The problem', 'Public APIs need a way to manage abusive request rates while keeping the gateway responsive.'],
      ['The solution', 'The scorer risk score adjusts per-client rate limits in real time. A 150 ms timeout lets requests continue when the scorer is unavailable.'],
      ['Load-test results', 'A k6 simulation blocked 99.16% of simulated bot requests while legitimate traffic stayed under 16 ms p95 latency. Prometheus and Grafana instrument traffic, latency, and rate limits.'],
    ]
  },
  ehr: {
    repository: 'https://github.com/Rishabh2815/DealIX',
    number: '03', title: 'DealIX', type: 'Personalized affordability decision-support project',
    stack: 'Python · FastAPI · Redis · deterministic cash-flow decisions',
    overview: 'A cash-flow-aware affordability tool that evaluates a proposed purchase against upcoming expenses, income, and a user-defined reserve.',
    sections: [
      ['What it is', 'A decision-support app for exploring whether a purchase fits an individual cash-flow plan.'],
      ['The problem', 'A current account balance alone can miss upcoming costs and the effect of scheduled payments.'],
      ['The solution', 'The project models cash-flow events and checks proposed payment plans against a personalized balance floor.'],
    ]
  },
  'aws-dr-simulations': {
    repository: 'https://github.com/Rishabh2815/AWS-Disaster-Recovery-Simulations.',
    number: '05', title: 'AWS Multi-Region Disaster Recovery', type: 'Terraform warm-standby architecture · January 2026',
    period: 'January 2026', stack: 'AWS VPC · ALB/ASG · RDS cross-region replicas · Route 53 · Terraform',
    overview: 'A modular, two-region warm-standby architecture covering networking, compute, database replication, and DNS failover. Warm standby balances recovery readiness with infrastructure cost.',
    sections: [
      ['What it is', 'An infrastructure-as-code project modeling an AWS disaster recovery setup across regions.'],
      ['The problem', 'A regional service disruption can interrupt access to applications and important data.'],
      ['The solution', 'Modular Terraform provisions VPC, ALB/ASG, RDS cross-region read replicas, and Route 53 health-checked failover.'],
      ['Failover test', 'A live failover simulation measured a 135-second recovery time objective (RTO) and a 1-second recovery point objective (RPO).'],
    ]
  },
  'fintech-mobile': {
    repository: 'https://github.com/Rishabh2815/Connect4',
    number: '04', title: 'Connect 4', type: 'Strategy-driven game and software design project',
    stack: 'Python · object-oriented design · game strategies',
    overview: 'An extensible implementation of Connect Four, with a turn-based game engine and configurable board and player strategies.',
    sections: [
      ['What it is', 'A playable, modular implementation of the classic two-player connection game.'],
      ['The problem', 'Game rules, player behavior, and win detection are easier to evolve when they are not entangled.'],
      ['The solution', 'The project separates the board, turn orchestration, players, and win-detection strategy.'],
    ]
  }
};

const archive = document.querySelector('.archive');
const dialog = document.querySelector('#case-overlay');
const closeButton = dialog.querySelector('.dialog-close');

window.addEventListener('error', (event) => {
  console.error('Portfolio could not load a project:', event.message);
});
let activeProject = null;
let returnFocusElement = null;

function setArchiveState(projectId = null) {
  activeProject = projectId;
  const isOpen = Boolean(projectId) || archive.matches(':hover');
  archive.classList.toggle('is-open', isOpen);
  archive.querySelectorAll('.project-folder').forEach((folder) => {
    folder.classList.toggle('is-highlighted', Boolean(projectId) && folder.dataset.project === projectId);
  });
}

function openProject(projectId, trigger) {
  const project = projects[projectId];
  if (!project || dialog.open) return;

  document.querySelector('#dialog-number').textContent = `PROJECT / ${project.number}`;
  document.querySelector('#dialog-type').textContent = project.type;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-overview').textContent = project.overview;
  document.querySelector('#dialog-period').textContent = project.period || '';
  document.querySelector('#dialog-stack').textContent = project.stack || '';
  document.querySelector('#dialog-facts').hidden = !project.period && !project.stack;
  document.querySelector('#dialog-repo').href = project.repository;
  const sections = document.querySelector('#case-sections');
  sections.replaceChildren(...project.sections.map(([heading, copy]) => {
    const section = document.createElement('section');
    section.className = 'case-section';
    const title = document.createElement('h3');
    title.textContent = heading;
    const description = document.createElement('p');
    description.textContent = copy;
    section.append(title, description);
    return section;
  }));

  dialog.returnValue = '';
  returnFocusElement = trigger;
  dialog.showModal();
  closeButton.focus();
  document.documentElement.style.overflow = 'hidden';
}

function closeProject() {
  if (dialog.open) dialog.close();
}

archive.addEventListener('pointerenter', () => setArchiveState(activeProject));
archive.addEventListener('pointerleave', () => setArchiveState(null));
archive.querySelectorAll('.project-folder').forEach((folder) => {
  folder.addEventListener('pointerenter', () => setArchiveState(folder.dataset.project));
  folder.addEventListener('pointerleave', () => {
    if (!folder.matches(':focus')) setArchiveState(null);
  });
  folder.addEventListener('focus', () => setArchiveState(folder.dataset.project));
  folder.addEventListener('blur', () => setArchiveState(null));
});
document.querySelectorAll('.project-card, .project-folder').forEach((button, index) => {
  if (button.classList.contains('project-card')) button.id = `project-card-${index + 1}`;
  button.addEventListener('pointerenter', () => {
    if (button.classList.contains('project-card')) setArchiveState(button.dataset.project);
  });
  button.addEventListener('pointerleave', () => {
    if (button.classList.contains('project-card') && !button.matches(':focus')) setArchiveState(null);
  });
  button.addEventListener('focus', () => {
    if (button.classList.contains('project-card')) setArchiveState(button.dataset.project);
  });
  button.addEventListener('blur', () => {
    if (!archive.contains(document.activeElement) && !document.querySelector('.project-card:focus')) setArchiveState(null);
  });
});

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.project-card[data-project]');
  if (!trigger || !document.body.contains(trigger)) return;
  event.preventDefault();
  openProject(trigger.dataset.project, trigger);
});

closeButton.addEventListener('click', closeProject);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeProject();
});
dialog.addEventListener('close', () => {
  document.documentElement.style.overflow = '';
  const trigger = returnFocusElement;
  returnFocusElement = null;
  if (trigger?.isConnected) requestAnimationFrame(() => trigger.focus());
});
