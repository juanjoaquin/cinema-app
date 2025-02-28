# Cinema App: Compra de boletos, elección de asientos, usuarios, y puntuajes.

Proyecto Full stack realizado con React js, TypeScript para el frontend, Laravel para el backend y MySQL para la base de datos.
Para la validación utilizo JWT aplicandolo desde el backend, y para almacenarlo utilizó LocalStorage. Cuando un usuario realizá un logout, este token es borrado. 
Mientras que para el diseño de la UI utilizó Taiwind CSS.

Es una aplicación de cine, donde la lógica de negocio se centra en que el usuario registrado, y autenticado pueda comprar boletos para la película que desee.
Las películas comparten salas, y poseen distintos horarios para poder elegir. Los asientos cambian determinado el tiempo en que la película se muestra, ya que 
generaría un error en las migraciones de los horarios de película.

Las rutas están protegidas desde el frontend, los usuarios no registrados solamente pueden ver la home page, las películas de forma dinámica, los horarios pero 
cuando quieran acceder a elegir uno, automáticamente serán reedireccionados hacia el componente de login.

Cuando los asientos estan ocupados, no pueden ser seleccionados, aquellos que estén disponibles estaran marcados en un color gris, y cuando uno seleccione se
pondrán en color verde, y abajo saldrá un indicativo en que fila, y que número de asiento fue seleccionado. 

Se cuenta con un formulario de pago para aquellos tickets que uno ha comprado, y con un historial detallado de cada una de las películas, el precio y los
asientos que fueron elegidos. Los tickets pueden ser cancelados hasta un lapso de 10 minutos, y en el historial figuraran como "cancelled" y después se borrara,
si esos 10 minutos pasan, no se podrán cancelar y el dinero no se podrá devolver.

Para hacerlo de una forma más realista, cada película tiene de forma dinámica una sección de comentarios y ratings, que únicamente pueden comentar y puntuar aquellas
personas que están loguedas con estrellas hasta un puntaje de 5 y mínimo de 1, y que pueden ser visto por todos los usuarios (incluyendo los no autenticados).
 
# Pasos a seguir para utilizarlo

1. Clonar el repositorio
2. Instalar Vite usando React + TypeScript
3. Una vez creado Laravel con Composer realizar las migraciones con `php artisan migrate`
4. Ejecutar `npm run dev` para la copilación del frontend.
5. Ejecutar `php artisan serve` para levantar el backend. 

# Imagenes del proyecto

![1](https://imgur.com/lRvIh6W.jpeg)
![2](https://imgur.com/rao4B8b.jpeg)
![3](https://imgur.com/QExlNbr.jpeg)
![4](https://imgur.com/ooBOLzR.jpeg)
![5](https://imgur.com/YtXkat5.jpeg)
![6](https://imgur.com/sEaC8a0.jpeg)
![7](https://imgur.com/Xg7t0Gj.jpeg)
![8](https://imgur.com/Uf3mRos.jpeg)
![9](https://imgur.com/khwqTo3.jpeg)
![10](https://imgur.com/tha3vxk.jpeg)
![11](https://imgur.com/cfYqziP.jpeg)
![12](https://imgur.com/t4mx33g.jpeg)
![13](https://imgur.com/nj4XoRY.jpeg)
![14](https://imgur.com/CS11CW8.jpeg)



