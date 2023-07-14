<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Pokedex - NestJS

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

5. Clonar el archivo ```.env.template``` y renombar la copia a ```
.env```

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicación en dev:
```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```
## Stack usado
* MongoDB
* Nest

## Temas

Validaciones

CRUD contra base de datos

Docker y Docker Compose

Conectar contenedor con filesystem (para mantener la data de la base de datos)

Schemas

Modelos

DTOs y sus extensiones

Uso de modelos en diferentes módulos

SEED para llenar la base de datos

Paginación de resultados

DTOs para Query parameters

Transformaciones de DTOs

Dockerizacion

Mongo Atlas

Env file

joi

Validation Schemas

Configuration Module

Recomendaciones para un Readme útil

Dockerfile

Despliegues

