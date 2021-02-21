
import { Command } from 'commander';
import { createDatabase } from "./index";

const program = new Command();

program
.command("restart")
.description("Restarts databse")
.action(async () => {
    await createDatabase();
    console.log("Database created!");
})

program.parse(process.argv);