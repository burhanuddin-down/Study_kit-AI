export interface SampleMaterial {
  id: string;
  title: string;
  subject: string;
  hint: string;
  text: string;
}

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'bio-cell-resp',
    title: 'Cellular Respiration & ATP Production',
    subject: 'Biology',
    hint: 'Cellular Biology - Chapter 8',
    text: `Cellular respiration is the biochemical process by which organisms combine oxygen with foodstuff molecules, diverting chemical energy into cellular activities and discarding carbon dioxide and water as waste products. The process is divided into three main stages: glycolysis, the citric acid cycle (Krebs cycle), and oxidative phosphorylation.

Glycolysis occurs in the cytoplasm and does not require oxygen (anaerobic). During glycolysis, a six-carbon glucose molecule is broken down into two three-carbon pyruvate molecules, producing a net gain of 2 ATP molecules and 2 NADH molecules through substrate-level phosphorylation.

Next, pyruvate enters the mitochondrial matrix where it is converted into acetyl-CoA before entering the Citric Acid Cycle (Krebs cycle). Each turn of the cycle generates NADH, FADH2, and 1 ATP (or GTP), releasing carbon dioxide as a byproduct. 

The final and most productive stage is oxidative phosphorylation, which takes place along the inner mitochondrial membrane (cristae). High-energy electrons donated by NADH and FADH2 pass through the electron transport chain (ETC). As electrons transfer through protein complexes, protons (H+) are pumped across the inner membrane into the intermembrane space, establishing an electrochemical proton gradient. This proton motive force drives protons back through the ATP synthase enzyme complex via chemiosmosis, synthesizing approximately 26 to 28 ATP molecules per glucose molecule. Oxygen acts as the final electron acceptor in the electron transport chain, binding with protons to form metabolic water. If oxygen is absent, the electron transport chain halts, forcing cells into anaerobic fermentation.`
  },
  {
    id: 'phys-momentum',
    title: 'Momentum and Newton’s Laws',
    subject: 'Physics',
    hint: 'Classical Mechanics - Unit 3',
    text: `Linear momentum (p) is defined as the product of an object's mass (m) and its velocity (v): p = mv. Momentum is a vector quantity having both magnitude and direction, pointing in the same direction as the velocity vector. The SI unit of linear momentum is kilogram meter per second (kg·m/s).

Newton's Second Law of Motion can be formulated in terms of momentum: the net external force acting on an object equals the time rate of change of its linear momentum (F_net = dp/dt). When mass remains constant, this simplifies to F_net = ma.

Impulse (J) is defined as the integral of force over the time interval during which it acts (J = F_avg * Δt), and according to the impulse-momentum theorem, impulse equals the total change in momentum of the object (J = Δp). Consequently, increasing the impact time during a collision drastically reduces the average force exerted on the colliding bodies.

The Law of Conservation of Linear Momentum states that the total linear momentum of an isolated system remains constant in the absence of net external forces. Collisions are classified into elastic collisions, where both total momentum and total kinetic energy are conserved, and inelastic collisions, where total momentum is conserved but kinetic energy is partially converted into internal thermal energy, sound, or deformation. In a perfectly inelastic collision, the interacting bodies stick together after impact and move with a single common velocity.`
  },
  {
    id: 'econ-monetary',
    title: 'Central Banking & Monetary Policy',
    subject: 'Economics',
    hint: 'Macroeconomics - Monetary Systems',
    text: `Monetary policy refers to the actions undertaken by a nation's central bank to control the overall money supply and achieve macroeconomic goals such as price stability, full employment, and sustainable economic growth. Central banks influence the economy primarily through three traditional instruments: open market operations, the discount rate, and reserve requirements.

Open market operations involve the purchase or sale of government securities in the secondary market. When the central bank purchases government bonds from commercial banks, it injects liquidity into the banking system, increasing bank reserves and lowering short-term nominal interest rates (expansionary monetary policy). Conversely, selling government bonds absorbs liquidity, decreases bank reserves, and raises interest rates (contractionary monetary policy).

The discount rate (or policy rate) is the interest rate charged to commercial banks when borrowing short-term funds directly from the central bank's lending facility. A higher discount rate increases borrowing costs for financial intermediaries, discouraging credit expansion throughout the broader economy.

Reserve requirements specify the minimum fraction of customer deposits that commercial banks must hold in vault cash or on deposit with the central bank. Raising reserve requirements decreases the money multiplier effect, diminishing the volume of loans banks can generate, while reducing requirements expands credit availability. In modern monetary regimes, many central banks also utilize interest on excess reserves (IOER) and forward guidance to manage inflation expectations.`
  }
];
