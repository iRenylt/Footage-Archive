# Guía de configuración de Footage Archive

Esta guía explica qué debes configurar manualmente, en qué archivo hacerlo y qué páginas o servicios necesitas visitar.

## 1. Archivo principal de configuración

Abre [config.js](config.js). Es el archivo principal del proyecto. Para cambiar textos no necesitas editar `app.js` ni los archivos de cada página.

## 2. Personalizar textos e interfaces

Dentro de `config.js` encontrarás el bloque `texts`. Puedes cambiar los mensajes activos de la portada, el acceso PIN, las notas y las cartas:

```js
texts: {
  accessCopy: "Escribe la clave para entrar.",
  home: {
    heroTitle: "Nuestro<br><em>archivo.</em>"
  },
  notes: {
    messageLabel: "Tu mensaje",
    messagePlaceholder: "Escribe algo bonito.",
    greetingName: "Nohelia",
    loveTitle: "El Amor de<br><em>Mi Vida.</em>"
  }
}
```

La estructura completa ya viene preparada en el archivo. Cambia únicamente el texto que quieras y conserva las comas, las comillas y las llaves. Para títulos que tienen una segunda línea en cursiva puedes conservar `<br>` y `<em>...</em>`.

También puedes cambiar el logo en `logoImage` y `logoAlt`, el PIN en `accessPin`, las canciones en `spotifyEmbed` y dentro de cada carta, y las imágenes iniciales de `galleryFallback`. Los mensajes automáticos, errores y estados de conexión se editan en `texts.system`.

También puedes editar directamente en `config.js`:

- `name`, `signature` e `intro` para la identidad general.
- `letters` para el año, fecha, título, texto y descripción de cada carta.
- `galleryFallback` para los títulos, captions e imágenes iniciales de la galería.

No cambies los nombres de propiedades como `page`, `galleryTable`, `commentsTable` ni los identificadores HTML como `pin-form`, `letters` y `gallery-stage`: son conexiones internas que permiten que todo siga funcionando.

Después de editar, abre la página y recarga con `Ctrl + F5`. Si publicas en GitHub Pages, vuelve a subir `config.js`, `app.js` y la guía junto con el resto del proyecto.

### Si todavía ves textos antiguos

La carpeta `.history` contiene copias creadas por el historial de VS Code. No son las páginas activas y no deben abrirse para comprobar el resultado. Las páginas que usa la web son `index.html`, `cartas.html`, `galeria.html`, `notas.html`, `carta-01.html` a `carta-11.html`, `app.js`, `config.js` y `styles.css`.

El service worker también puede conservar una versión anterior durante una publicación. En ese caso:

1. Publica de nuevo todos los archivos del proyecto.
2. Abre la web y pulsa `Ctrl + F5`.
3. Si continúa igual, abre las herramientas del navegador, entra en **Application > Service Workers**, pulsa **Unregister**, borra los datos del sitio y vuelve a cargar.

La caché del proyecto se actualiza ahora con la versión `footage-archive-v4`, elimina versiones anteriores y consulta la red para los archivos HTML, `app.js` y `config.js`.

Los campos más importantes son:

```js
logoImage: "URL_DE_TU_LOGO",
logoAlt: "Descripción de tu logo",
accessPin: "0906",
spotifyEmbed: "URL_EMBED_DE_SPOTIFY",
```

### Logo

1. Sube tu logo a un servicio público o usa una imagen que ya tenga una URL pública.
2. Copia la URL directa de la imagen.
3. Pégala en `logoImage`.
4. Escribe una descripción en `logoAlt` para accesibilidad.

Ejemplo:

```js
logoImage: "https://ejemplo.com/mi-logo.png",
logoAlt: "Logo de nuestro archivo",
```

### PIN

Cambia `accessPin` si quieres usar otro código de cuatro números:

```js
accessPin: "4821",
```

Usa siempre cuatro números porque los formularios HTML tienen una validación de cuatro dígitos.

## 2. Spotify general

El reproductor de la sección Cartas usa `spotifyEmbed` como canción de respaldo.

1. Abre [Spotify Web](https://open.spotify.com/).
2. Busca una canción, álbum o playlist.
3. Pulsa los tres puntos junto al contenido.
4. Elige **Compartir**.
5. Elige **Insertar** o **Embed**.
6. Copia únicamente la URL del iframe, que empieza normalmente por:

```text
https://open.spotify.com/embed/
```

7. Pega la URL en `spotifyEmbed` dentro de `config.js`.

No uses la URL normal `https://open.spotify.com/track/...` porque el reproductor necesita la URL `/embed/`.

## 3. Spotify independiente para cada carta

Cada carta tiene su propia propiedad `spotifyEmbed` dentro del array `letters` de `config.js`.

Ejemplo:

```js
{
  year: "2025",
  date: "Primera carta",
  title: "Para cuando necesites recordar",
  text: "Tu texto va aquí.",
  detail: "Un detalle breve sobre esta carta.",
  page: "carta-01.html",
  spotifyEmbed: "https://open.spotify.com/embed/track/ID_DE_LA_CANCION"
}
```

Para cambiar la música de una carta:

1. Busca la carta correspondiente dentro de `config.js`.
2. Localiza su propiedad `spotifyEmbed`.
3. Reemplaza solo la URL.
4. Guarda el archivo y vuelve a publicar en GitHub Pages.

Todas las cartas usan la misma plantilla visual y cargan su Spotify desde esta configuración.

## 4. Textos y archivos de cartas

Las cartas se registran en `config.js` y tienen una página HTML individual.

Archivos actuales:

- `carta-01.html` a `carta-11.html`

Para editar una carta existente:

1. Abre `config.js`.
2. Busca el objeto de la carta.
3. Cambia `text` para el contenido.
4. Cambia `title` para el título.
5. Cambia `detail` para la descripción corta.
6. Mantén `page` exactamente igual que el nombre del archivo HTML.
7. Cambia `spotifyEmbed` si quieres otra canción.

La página individual obtiene automáticamente el texto, año, detalles y Spotify desde `config.js`.

### Añadir otra carta

1. Crea un archivo con el patrón `carta-12.html`.
2. Copia la estructura de cualquier carta existente, por ejemplo `carta-11.html`.
3. Añade un nuevo objeto dentro de `letters` en `config.js`.
4. Usa `page: "carta-12.html"`.
5. Define `year`, `date`, `title`, `text`, `detail` y `spotifyEmbed`.
6. La carta aparecerá automáticamente agrupada en `cartas.html`.

No cambies los identificadores `full-letter`, `letter-content` ni `pin-form`, porque `app.js` los necesita.

## 5. Supabase: crear el proyecto

Supabase es el sistema que guarda los mensajes de Notas y las imágenes de Galería.

1. Abre [Supabase](https://supabase.com/).
2. Crea una cuenta o inicia sesión.
3. Pulsa **New project**.
4. Elige una organización.
5. Escribe un nombre para el proyecto.
6. Define una contraseña segura para la base de datos.
7. Elige una región cercana.
8. Espera a que termine la creación.

## 6. Obtener URL y anonKey

En el panel de Supabase:

1. Abre **Project Settings**.
2. Entra en **API**.
3. Copia **Project URL**.
4. Copia la clave pública **anon / publishable key**.
5. Abre `config.js`.
6. Pega los valores aquí:

```js
supabase: {
  url: "https://TU-PROYECTO.supabase.co",
  anonKey: "TU_ANON_KEY_PUBLICA",
  galleryTable: "gallery_items",
  commentsTable: "comentarios",
  commentsMessageColumn: "mensaje",
  galleryBucket: "gallery"
}
```

Usa únicamente la clave pública `anon`. Nunca pegues una clave `service_role` en una web que se publica en GitHub Pages.

## 7. Tabla de mensajes de Notas

En Supabase:

1. Abre **SQL Editor**.
2. Pulsa **New query**.
3. Pega y ejecuta:

```sql
create table comentarios (
  id bigint generated by default as identity primary key,
  mensaje text not null,
  created_at timestamptz default now()
);

alter table comentarios enable row level security;

create policy "public can send comments"
on comentarios for insert
with check (true);
```

El formulario usa la tabla indicada por `commentsTable`.

Si tu tabla tiene otro nombre:

1. Cambia `commentsTable` en `config.js`.
2. Comprueba que tenga una columna `mensaje` de tipo `text`.
3. Mantén `commentsMessageColumn: "mensaje"` en `config.js` para que la aplicación use el nombre correcto.

### Qué ocurre si el mensaje está vacío

La aplicación elimina los espacios al principio y al final. Si no queda texto:

- No llama a Supabase.
- No guarda nada localmente.
- Muestra una notificación explicando el motivo.

Si Supabase, la API o la conexión tienen un error, tampoco se realiza el envío y se informa al usuario.

## 8. Tabla de imágenes de Galería

En el mismo **SQL Editor** ejecuta:

```sql
create table gallery_items (
  id bigint generated by default as identity primary key,
  slot integer not null unique,
  title text,
  caption text,
  image_url text not null,
  created_at timestamptz default now()
);

alter table gallery_items enable row level security;

create policy "public can read gallery"
on gallery_items for select
using (true);

create policy "public can create gallery"
on gallery_items for insert
with check (true);

create policy "public can update gallery"
on gallery_items for update
using (true)
with check (true);
```

El nombre debe coincidir con `galleryTable` en `config.js`.

Si `gallery_items` ya existía, ejecuta esta migración antes de subir nuevas imágenes:

```sql
alter table gallery_items add column if not exists slot integer;
update gallery_items set slot = id where slot is null;
create unique index if not exists gallery_items_slot_key on gallery_items(slot);
```

La aplicación conserva 40 posiciones estables. Cada imagen nueva se guarda con el `slot` del muro actual, por lo que subir una imagen al muro 12 no modifica ningún otro muro.

## 9. Bucket para imágenes

En Supabase:

1. Abre **Storage**.
2. Pulsa **New bucket**.
3. Escribe `gallery` como nombre.
4. Activa la opción de bucket público si aparece.
5. Crea el bucket.
6. Abre **Storage Policies** o el apartado de políticas del bucket.
7. Ejecuta estas políticas desde **SQL Editor**:

```sql
create policy "public can upload gallery images"
on storage.objects for insert
with check (bucket_id = 'gallery');

create policy "public can read gallery images"
on storage.objects for select
using (bucket_id = 'gallery');
```

Si eliges otro nombre de bucket, usa el mismo nombre en `config.js`:

```js
galleryBucket: "mi-bucket"
```

## 10. Cómo funciona la Galería

Cuando se pulsa una imagen del muro:

1. Se abre el selector de archivos.
2. La aplicación comprueba que sea una imagen.
3. La imagen se sube al bucket configurado.
4. Se obtiene una URL pública.
5. Si el muro ya tiene `id`, se actualiza su `image_url`.
6. Si todavía no tiene `id`, se crea una fila nueva en `gallery_items`.
7. El muro se actualiza con la imagen sincronizada.

Si Storage o la tabla fallan, la aplicación no presenta la imagen como sincronizada y muestra el motivo.

## 11. Probar antes de publicar

Puedes abrir `index.html` directamente, aunque algunas funciones del navegador pueden requerir un servidor local.

En VS Code:

1. Instala la extensión **Live Server**.
2. Haz clic derecho sobre `index.html`.
3. Elige **Open with Live Server**.
4. Abre la URL local que aparezca.
5. Comprueba el PIN.
6. Abre Cartas, Galería y Notas.
7. En Notas prueba enviar un campo vacío: debe rechazarlo.
8. Escribe un mensaje y confirma que Supabase esté configurado.
9. En Galería pulsa una imagen y sube una imagen de prueba.
10. Comprueba la fila en `gallery_items` y el archivo en Storage.

## 12. Publicar en GitHub Pages

1. Crea un repositorio en [GitHub](https://github.com/).
2. Sube todos los archivos del proyecto, incluyendo `config.js`, HTML, CSS, JavaScript, `manifest.json`, `sw.js` y `assets/`.
3. Entra en **Settings** del repositorio.
4. Abre **Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Selecciona la rama principal, normalmente `main`.
7. Selecciona la carpeta `/root`.
8. Pulsa **Save**.
9. Espera a que GitHub genere la página.
10. Abre la URL que aparece en la sección Pages.

Cada vez que cambies `config.js`, HTML o CSS:

1. Sube los cambios al repositorio.
2. Espera a que GitHub Pages vuelva a publicar.
3. Recarga usando `Ctrl + F5` si el navegador muestra una versión antigua.

## 13. Fecha de actualización

La portada muestra la última modificación usando `document.lastModified`.

El campo de respaldo está en `config.js`:

```js
lastUpdated: "2026-09-03",
```

Si el navegador o el servidor no entregan una fecha válida, se muestra esta fecha de respaldo. Puedes cambiarla manualmente antes de publicar:

```js
lastUpdated: "2026-10-15",
```

## 14. Checklist final

Antes de compartir la web, comprueba:

- `config.js` tiene la URL correcta de Supabase.
- `config.js` tiene la `anonKey` pública correcta.
- `commentsTable` coincide con la tabla de mensajes.
- `galleryTable` coincide con la tabla de imágenes.
- `galleryBucket` coincide con el bucket de Storage.
- Las políticas de las dos tablas están creadas.
- Las políticas de Storage están creadas.
- El mensaje vacío se rechaza.
- Un error de API muestra una notificación y no guarda nada.
- Una imagen subida aparece en Storage.
- Una imagen de un muro actualiza su fila correcta.
- Todas las cartas abren desde `cartas.html`.
- Cada carta tiene un Spotify válido con `/embed/`.
- La web se ve bien en móvil.
- GitHub Pages está publicando la última versión.
