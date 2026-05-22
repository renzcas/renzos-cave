// engine/EnergyLines.js — Pulsing Energy Network Organ
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';

export class EnergyLines {
    constructor({ scene, chamber, symbolic, dynasty }) {
        this.scene = scene;
        this.chamber = chamber;
        this.symbolic = symbolic;
        this.dynasty = dynasty;

        this.t = 0;

        this.group = new THREE.Group();
        scene.add(this.group);

        this.createNodes();
        this.createLines();
    }

    // --------------------------
    // Nodes (Portal, Symbol Node, Operator Node)
    // --------------------------
    createNodes() {
        const geo = new THREE.SphereGeometry(0.12, 16, 16);

        this.portalNode = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({ color: 0xff00ff })
        );
        this.portalNode.position.set(0, 2, -4);

        this.symbolNode = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({ color: 0x00e0ff })
        );
        this.symbolNode.position.set(2.5, 1.5, -1);

        this.operatorNode = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.operatorNode.position.set(0, 1.2, 0);

        this.group.add(this.portalNode);
        this.group.add(this.symbolNode);
        this.group.add(this.operatorNode);
    }

    // --------------------------
    // Lines between nodes
    // --------------------------
    createLines() {
        const mat = new THREE.LineBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.6
        });

        const makeLine = (a, b) => {
            const points = [a.position.clone(), b.position.clone()];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            return new THREE.Line(geo, mat.clone());
        };

        this.linePortalToSymbol = makeLine(this.portalNode, this.symbolNode);
        this.lineSymbolToOperator = makeLine(this.symbolNode, this.operatorNode);
        this.lineOperatorToPortal = makeLine(this.operatorNode, this.portalNode);

        this.group.add(this.linePortalToSymbol);
        this.group.add(this.lineSymbolToOperator);
        this.group.add(this.lineOperatorToPortal);
    }

    // --------------------------
    // Update Loop
    // --------------------------
    update(dt) {
        this.t += dt;

        // Pulse intensity based on Operator Aura
        const aura = this.dynasty.current.aura;
        const pulse = 0.4 + Math.sin(this.t * 4) * 0.3 * aura;

        this.linePortalToSymbol.material.opacity = pulse;
        this.lineSymbolToOperator.material.opacity = pulse;
        this.lineOperatorToPortal.material.opacity = pulse;

        // Symbolic Engine influences color
        const arche = this.symbolic.state.archetype;

        if (arche === "Dragon") this.setColor("#ff0000");
        if (arche === "Tiger") this.setColor("#ffaa00");
        if (arche === "Serpent") this.setColor("#00ff88");
        if (arche === "Phoenix") this.setColor("#ff00ff");
        if (arche === "Bear") this.setColor("#8888ff");
    }

    setColor(hex) {
        this.linePortalToSymbol.material.color.set(hex);
        this.lineSymbolToOperator.material.color.set(hex);
        this.lineOperatorToPortal.material.color.set(hex);
    }
}
