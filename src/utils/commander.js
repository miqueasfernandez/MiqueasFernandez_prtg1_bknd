//Instalamos: npm install commander

import { Command } from "commander";
const program = new Command(); 

//1 - Comando // 2- La descripcion // 3- Valor por default
program
    .option("-p <port>", "Puerto en donde se inicia el servidor", 8080)
    .option("--mode <mode>", "modo de trabajo", "produccion")
program.parse(); 

//Para verificar las opciones que ya configure: 
//console.log("Opciones : ", program.opts()); 

export default program; 