class role {
    name!: string
    picture!: string
    description!: string
}

const roles: role[] = [
    { name: "Spielleiter", picture: "cards/game_master.png", description: "Du leitest das Spiel. Wenn alle ihre Rollen kennen bekommst du das Handy. Ihr könnt auch selbst einen Spielleiter bestimmen, dar normal im Spiel mitspielt." },
    { name: "Werwolf", picture: "cards/werwolf.png", description: "Du darfst mit deinen Artgenossen nachts einen Dorfbewohner töten" },
    { name: "Dorfbewohner", picture: "cards/villager.png", description: "Du versuchst, die Werwölfe zu finden. Du schläfst Nachts und darfst Tags abstimmen" },
    { name: "Seher", picture: "cards/seer.png", description: "Wenn du gerufen wirst, darfst du jede Nacht die Identität einer Person erfahren" },
    { name: "Hexe", picture: "cards/witch.png", description: "Du hast 2 Zaubertränke. Mit dem einen kannst du einmal im Spiel jemanden töten, mit dem anderen kannst du ein Opfer der Werwölfe retten. Du darfst beide in derselben Nacht nutzen" },
    { name: "Jäger", picture: "cards/hunter.png", description: "Du bist ein normaler Dorfbewohner, aber wenn du stirbst darfst du jemanden mit in den Tod reißen" },
    { name: "Amor", picture: "cards/amor.png", description: "Du bist ein normaler Dorfbewohner, darfst aber in der ersten Nacht ein Liebespaar bestimmen. Wenn einer von ihnen stirbt, reißt er den anderen mit in den Tod" },
    { name: "Gerber", picture: "cards/tanner.png", description: "Du bist ein armer Kerl. Du hasst deinen Beruf so sehr, dass du sterben willst. Du gewinnst indem du stirbst." }
]

let rolesOrder: number[] = [0, 2, 2, 1, 3, 1, 2, 4, 2, 2, 5, 2, 1, 2, 6, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2]

function assignRoles(): void {
    const usedRoles: role[] = [];
    let i = 0;
    localStorage.removeItem("rolesCount")
    roles.forEach((role, index) => {
        const inputElem = document.querySelector<HTMLInputElement>(`input[name="role-${role.name}-count"]`);
        const count = inputElem ? parseInt(inputElem.value) : 0;
        for (i = 0; i < count; i++) {
            usedRoles.push(role);
        }
        //safe roles count for next round
        const rolesCountString = localStorage.getItem("rolesCount");
        const storedRolesCount: [role, number][] = rolesCountString ? JSON.parse(rolesCountString) : [];
        storedRolesCount.push([role, i]);
        localStorage.setItem("rolesCount", JSON.stringify(storedRolesCount));
    });

    playerNames.forEach((player) => {
        const randomIndex = Math.floor(Math.random() * usedRoles.length);
        playersWithRoles.push({ player: player, role: usedRoles[randomIndex] });
        usedRoles.splice(randomIndex, 1);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const rolesListDiv = document.getElementById("rolesList");

    //Print Roles on Screen
    if (rolesListDiv) {
        roles.forEach((role, index) => {
            const fieldDiv = document.createElement("div");
            fieldDiv.className = "role";

            const nameElem = document.createElement("h3");
            nameElem.textContent = role.name;

            const descElem = document.createElement("p");
            descElem.textContent = role.description;

            const inputElem = document.createElement("input");
            inputElem.type = "number";
            inputElem.min = "0";
            inputElem.value = "0";
            inputElem.name = `role-${role.name}-count`;
            inputElem.id = `role-${role.name}-count`;

            fieldDiv.appendChild(nameElem);
            fieldDiv.appendChild(inputElem);
            fieldDiv.appendChild(descElem);

            rolesListDiv.appendChild(fieldDiv);
        });
    }

    //Import Roles from last round
    const rolesCountString = localStorage.getItem("rolesCount");
    if (rolesCountString) {
        const storedRolesCount: [role, number][] = rolesCountString ? JSON.parse(rolesCountString) : [];
        if (storedRolesCount && storedRolesCount.length > 0) {
            storedRolesCount.forEach(([role, number]) => {
                let roleCountInputElement = document.getElementById(`role-${role.name}-count`) as HTMLInputElement;
                if (roleCountInputElement) {
                    roleCountInputElement.value = number.toString();
                }
            });
        }
    }
})