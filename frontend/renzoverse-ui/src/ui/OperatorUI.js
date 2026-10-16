// OperatorUI.js — command controls remain unavailable until the backend supports them.
export class OperatorUI {
  constructor() {
    this.root = document.createElement("div");
    this.root.id = "operator-ui";
    this.root.setAttribute("role", "status");
    document.body.appendChild(this.root);

    this.root.textContent = "Command controls will be available when the backend supports them.";
  }
}
