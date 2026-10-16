# Renzo's Cave: Operator Chamber

The Vite page is a small interactive learning scene for linear operators and Hilbert-space geometry.
The chamber uses `R²` with its ordinary inner product: rotations are norm-preserving, projections
can contract a state, and a nonzero commutator shows that operator order matters.

The Three.js chamber embeds that two-dimensional operator action in its floor plane. The room
projection is fixed; the controls change the player operator. The displayed resonance is a
normalized commutator score for this demonstration, not a general measure of learning or model
quality. The dragon and trog images are animated billboard artwork, not rigged 3D character models.

Run from this directory:

```sh
npm run dev
```

Build and verify the operator calculations:

```sh
npm test
npm run build
```
