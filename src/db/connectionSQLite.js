import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import clienteAxios from '../api/clienteAxios'

class APISQLite {

    constructor(props) {
        this.db = null
        this.dbInfoo = null
    }

    async eliminarBaseDeDatos() {
        console.log("Entra a eliminar...");
        const databaseName = "inventary.sqlite";
        const dbPath = FileSystem.documentDirectory + "SQLite/" + databaseName;
      
        // Verificar si la base de datos existe
        const dbInfo = await FileSystem.getInfoAsync(dbPath);
        if (dbInfo.exists) {
          // Si existe, eliminar el archivo de la base de datos
          await FileSystem.deleteAsync(dbPath);
          console.log("Base de datos eliminada:", dbPath);
        } else {
          console.log("No existe para eliminar.");
        }
      }


    async abrirBaseDeDatos() {
        const databaseName = "inventary.sqlite"
        const sqlLiteDir = FileSystem.documentDirectory + "SQLite/"
        const dbPath = FileSystem.documentDirectory + 'SQLite/inventary.sqlite';// Ruta de la base de datos
        const dbInfo = await FileSystem.getInfoAsync(dbPath);

        if (!dbInfo.exists) {
            this.db = await SQLite.openDatabaseAsync(databaseName)
            await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS lugar (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                edificio TEXT,
                area TEXT);`);

            await this.db.execAsync(
                `CREATE TABLE IF NOT EXISTS inventario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT,
                estatus INTEGER)`);
                    
            await this.db.execAsync(
                `CREATE TABLE IF NOT EXISTS bien (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    numero_activo INTEGER,
                    subnumero INTEGER,
                    descripcion TEXT,
                    material TEXT,
                    color TEXT,
                    marca TEXT,
                    modelo TEXT,
                    serie TEXT,
                    estado TEXT,
                    id_lugar INTEGER,
                    imagen TEXT,
                    FOREIGN KEY(id_lugar) REFERENCES lugar ('id'))`);


            await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS inventario_bien (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                localizado INTEGER,
                id_bien INTEGER,
                id_inventario INTEGER,
                FOREIGN KEY(id_bien) REFERENCES bien (id),
                FOREIGN KEY(id_inventario) REFERENCES inventario (id),
                UNIQUE (id_bien, id_inventario)
            );`);        
            console.log("Base de datos y tablas creadas con éxito.");
            const allRows = await this.db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table';`);
            for (const row of allRows) {
            console.log("Tabla:", row);
            }

            await this.poblarBaseDeDatos(); // Si tienes un método para poblar la base de datos
        } else {
            // Si la base de datos ya existe, abrirla
            console.log("La base de datos: " + databaseName + " ya existe");
            console.log("En la dirección: " + sqlLiteDir + databaseName);
            this.db = await SQLite.openDatabaseAsync(databaseName)
            const allRows = await this.db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table';`);
            for (const row of allRows) {
                console.log("Tabla:", row);
            }
        }

        const dbPathh = FileSystem.documentDirectory + 'SQLite/inventary.sqlite';
        this.dbInfoo = await FileSystem.getInfoAsync(dbPathh);
        console.log('Tamaño del archivo de la base de datos:', this.dbInfoo.size);
        console.log("Direccion de la BD: ", dbPathh)
        return true;
    }    

    async updateImageBien(id, imagen){
        console.log("Antes de actualizar imagen, id: ", id)
        try{
            let statement = await this.db.prepareAsync(
                `update bien set imagen = $imagen where id = $id`
            )

            let result = await statement.executeAsync({
                $imagen: imagen,
                $id: id
            })
            if(await this.updateImageBienToAPIREST(id, imagen) === 200){
                return {success:true, message:"Bien actualizado en API REST y en local"}
            }
            else{
                return {success:true, message:"Bien actualizado en local"}
            }
            
        }catch(error){
            console.log(error)
            return {success:false, message:"Imagen no actualizada"}
        }
    }

    async updateImageBienToAPIREST(id, imagen){
        try {
            // Hacer la solicitud PUT a la API, enviando el id y la imagen
            const response = await clienteAxios.put(`/api/bienes/${id}`, {
                imagen: imagen  // Datos que enviarás en el cuerpo de la solicitud
            });
    
            if (response.status === 200) {
                console.log("Imagen actualizada con éxito:", response.data);
            } else {
                console.log("No se pudo actualizar la imagen. Código de estado:", response.status);
            }
            return response.status
        } catch (error) {
            console.log("Error al hacer la solicitud PUT:", error);
        }
    }

    async insertInventarioToAPIREST(newInventario){
        try{
            const response = await clienteAxios.post(`/api/inventarios`, newInventario)

            if (response.status === 200 || response.status === 201){
                console.log("Inventario ingresado en la API REST: ", response.data)                
            }
            else{
                console.log("Inventario no se ingresó en la API REST: ", response.status)
            }
        } catch(error){
            console.log("Error: ", error)
        }
    }

    async poblarBaseDeDatos(){
        console.log("Poblando base de datos...")
        lugares = await this.getDataFromAPIREST('lugares')
        this.insertarRegistrosFromJSONWithAutoIncrementId('lugar', lugares)
        inventarios = await this.getDataFromAPIREST('inventarios')
        this.insertarRegistrosFromJSONWithAutoIncrementId('inventario', inventarios)
        bienes = await this.getDataFromAPIREST('bienes')
        this.insertarRegistrosFromJSONWithAutoIncrementId('bien', bienes)
        inventario_bien = await this.getDataFromAPIREST('inventario_bien')
        this.insertarRegistrosFromJSONWithAutoIncrementId('inventario_bien', inventario_bien)
        console.log("Base de datos poblada de la API REST!")
    }

    async getDataFromAPIREST(api){
        try{
            const response = await clienteAxios.get(`/api/${api}`)
            if (response.status === 200){
                //console.log(response.data)
                return response.data
            }
            else{
                console.log(response.status)
            }
        }catch(error) {
            console.log("Error en la solicitud: ", error)
        }        
        return null
    }

    insertarRegistrosFromJSONWithAutoIncrementId(table, rowsJSON) {
        console.log("InsertarRegistrosFromJSONWithAutoIncrementId:")
        console.log(table)
        rowsJSON.forEach(async row => {
            let array_fields = this.getArrayFields(row)
            let array_params = this.getArrayParams(row)
            const result = await this.db.runAsync(`INSERT INTO ${table} (${this.getQueryFields(array_fields)}) values (${this.getQueryValues(array_params)})`, array_params)
            //console.log(result.lastInsertRowId, result.changes);              
        })       
        return true
    }

    getQueryFields(array_fields) {
        let fields = ""
        for (let i = 0; i < array_fields.length; i++) {
            if (i < array_fields.length - 1)
                fields += `${array_fields[i]}, `
            else
                fields += `${array_fields[i]}`
        }
        return fields
    }

    getQueryValues(array_params) {
        let params = ""
        for (let i = 0; i < array_params.length; i++) {
            if (i < array_params.length - 1)
                params += "?, "
            else
                params += "?"
        }
        return params
    }

    getArrayFields(row) {
        let array_fields = []
        Object.entries(row).forEach(([key, value]) => {
            array_fields.push(key)
        })
        return array_fields
    }

    getArrayParams(row) {
        let array_params = []
        Object.entries(row).forEach(([key, value]) => {
            array_params.push(value)
        })
        return array_params
    }

    createValuesString(row) {
        let values = ""
        Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'string')
                values += "'" + value + "',"
            else if (typeof value === 'number')
                values += value.toString() + ","
        })
        console.log(values)
        return values.substring(0, values.lastIndexOf(",")-1)
    }

    async getValuesWithCallback(tableName, callback){
        try{            
            const statement = await this.db.prepareAsync(`SELECT * FROM ${tableName}`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            
            return allRows
            //callback(allRows) En vez de ejecutar una función, solo regreso el contenido de mi función
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    async getLugaresConBienes(){
        try{
            const statement = await this.db.prepareAsync(
                'SELECT lugar.* from lugar inner join bien on lugar.id = bien.id_lugar group by (lugar.id);'
            );
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    //Bienes localizados solo del inventario
    async getBienesLocalizados(id_inventario){
        try{
            const statement = await this.db.prepareAsync(
                `Select bien.id, bien.numero_activo, bien.descripcion 
                    from bien 
                    inner join inventario_bien on inventario_bien.id_bien = bien.id 
                    where inventario_bien.localizado = 1 and inventario_bien.id_inventario = ${id_inventario};`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    //Bienes NO localizados solo del inventario
    async getBienesNoLocalizados(id_inventario){
        try{
            const statement = await this.db.prepareAsync(
                `Select bien.id, bien.numero_activo, bien.descripcion 
                    from bien 
                    inner join inventario_bien on inventario_bien.id_bien = bien.id
                    where inventario_bien.localizado = 0 and inventario_bien.id_inventario = ${id_inventario};`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    async getLastBienLocatedFromPlace(id_inventario, id_lugar){
        try{
            const statement = await this.db.prepareAsync(
                `Select bien.* 
                    from bien 
                    inner join inventario_bien on inventario_bien.id_bien = bien.id 
                    inner join lugar on lugar.id = bien.id_lugar
                    where inventario_bien.id_inventario = ${id_inventario} and inventario_bien.localizado = 1 and lugar.id = ${id_lugar}
                    ORDER BY bien.id DESC 
                    limit 1;`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            console.log(allRows)
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    //Bienes localizados del place
    async getBienesLocatedFromPlace(id_inventario, id_lugar){
        try{
            const statement = await this.db.prepareAsync(
                `Select bien.* 
                    from bien 
                    inner join inventario_bien on inventario_bien.id_bien = bien.id 
                    inner join lugar on lugar.id = bien.id_lugar
                    where inventario_bien.id_inventario = ${id_inventario} and inventario_bien.localizado = 1 and lugar.id = ${id_lugar};`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            console.log(allRows)
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    async getBienesUnlocatedFromPlace(id_inventario, id_lugar){
        try{
            const statement = await this.db.prepareAsync(
                `Select bien.* 
                    from bien 
                    inner join inventario_bien on inventario_bien.id_bien = bien.id 
                    inner join lugar on lugar.id = bien.id_lugar
                    where inventario_bien.id_inventario = ${id_inventario} and inventario_bien.localizado = 0 and lugar.id = ${id_lugar};`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            console.log(allRows)
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    async getLastInventoryInserted(){
        try{
            //select * from inventario  order by id DESC limit 1;
            const statement = await this.db.prepareAsync(
                `select * from inventario order by id DESC limit 1;`);
            const result = await statement.executeAsync();

            const allRows = await result.getAllAsync();
            console.log(allRows)
            return allRows;
        }
        catch(error){
            console.log("Error: ", error)
        }
    }

    async fillBienesWithInventary(id_inventario) {
        try {
            // Obtener todos los bienes
            const bienes = await this.getValuesWithCallback("bien");
    
            if (bienes && bienes.length > 0) {
                // Iterar sobre cada bien y asociarlo en la tabla inventario_bien
                for (const row of bienes) {
                    let id_bien = row.id;
                    
                    // Preparar e insertar el registro en inventario_bien
                    const statement = await this.db.prepareAsync(
                        `INSERT INTO inventario_bien (id_inventario, id_bien, localizado) VALUES (?, ?, 0)`
                    );
                    await statement.executeAsync([id_inventario, id_bien]);
                }
                const inventarioBienData = bienes.map(row => ({
                    id_inventario: id_inventario,
                    id_bien: row.id,
                    localizado: 0
                }));
                if(await this.fillInventoryBienToAPIREST(inventarioBienData)){
                    return true;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    }

    async fillInventoryBienToAPIREST(inventarioBienData){
        if (inventarioBienData.length > 0) {
            try {
                // Enviamos la lista como parámetro en la solicitud POST
                const response = await clienteAxios.post('/api/inventario_bien', inventarioBienData);
    
                if (response.status === 200 || response.status === 201) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log("Error en el catch al enviar datos a la API REST:", error);
                return false;
            }
        } else {
            console.log("No hay datos para enviar a la API.");
            return false;
        }
    }
}

export default new APISQLite();
