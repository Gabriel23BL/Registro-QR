import { ModelDepartamento } from "../Model/ModelDepartamento.js";

export class ControladorDepartamento {
    async mostrarDepartamentos(req, res) {
        try {
        const departamentos = await ModelDepartamento.obtenerDepartamentos();
        res.render("departamento", { departamentos });
        } catch (error) {
        console.error("[ControladorDepartamento] Error al mostrar departamentos:", error.message);
        res.status(500).json({ error: "Error al mostrar departamentos" });
        }
    }

    async agregarDepartamento(req, res) {
        try {
            const { nombre } = req.body;
            if (!nombre || nombre.trim() === "") {
                return res.status(400).json({ error: "Nombre y descripción son requeridos" });
            }
            await ModelDepartamento.agregarDepartamento(nombre);
            res.status(201).json({ message: "Departamento agregado exitosamente" });
        } catch (error) {
            console.error("[ControladorDepartamento] Error al agregar departamento:", error.message);
            res.status(500).json({ error: "Error al agregar departamento" });
        }
    }

    async editarDepartamento(req,res) {
        try {
            const { id } = req.params;
            const { nombre } = req.body;
            if (!nombre || nombre.trim() === "") {
                return res.status(400).json({ error: "Nombre es requerido" });
            }
            await ModelDepartamento.editarDepartamento(id, nombre);
            res.status(200).json({ message: "Departamento editado exitosamente" });
        } catch (error) {
            console.error("[ControladorDepartamento] Error al editar departamento:", error.message);
            res.status(500).json({ error: "Error al editar departamento" });
        }
    }

    async eliminarDepartamento(req, res) {
        try {
            const { id } = req.params;
            await ModelDepartamento.eliminarDepartamento(id);
            res.status(200).json({ message: "Departamento eliminado exitosamente" });
        } catch (error) {
            console.error("[ControladorDepartamento] Error al eliminar departamento:", error.message);
            res.status(500).json({ error: "Error al eliminar departamento" });
        }
    }

}

