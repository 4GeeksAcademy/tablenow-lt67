import random

def obtener_recomendacion_conserje(pregunta, restaurantes_data):
    """
    Conserje Inteligente de TableNow (Versión de Respaldo Garantizada)
    Esta versión procesa los datos localmente para evitar errores de API o región.
    """
    print(f"\n--- DEBUG CONSERJE ---")
    print(f"Restaurantes recibidos desde la DB: {len(restaurantes_data)}")
    print(f"Pregunta del usuario: {pregunta}")

    if not restaurantes_data:
        return "¡Hola! Soy tu conserje de TableNow. Aún no tengo restaurantes registrados en mi base de datos para recomendarte. ¡Vuelve pronto!"

    pregunta_low = pregunta.lower()
    mejor_opcion = None
    
    # Lógica de búsqueda inteligente por palabras clave
    for rest in restaurantes_data:
        # Extraemos los datos del restaurante
        nombre = rest.get('name', '')
        categoria = rest.get('category', '')
        tags = str(rest.get('tags', '')).lower()
        
        # Creamos una cadena de búsqueda
        contenido_busqueda = f"{nombre} {categoria} {tags}".lower()
        
        # 1. Prioridad: Pizza
        if "pizza" in pregunta_low and "pizza" in contenido_busqueda:
            mejor_opcion = rest
            break
        # 2. Prioridad: Citas o Romántico
        elif ("romantico" in pregunta_low or "cita" in pregunta_low or "pareja" in pregunta_low):
            if "romántico" in contenido_busqueda or "romantico" in contenido_busqueda or "cita" in contenido_busqueda:
                mejor_opcion = rest
                break
        # 3. Prioridad: Italiana
        elif "italiana" in pregunta_low and "italiana" in contenido_busqueda:
            mejor_opcion = rest
            break

    # Si no encontró una coincidencia exacta, elige uno al azar para no dejar al usuario vacío
    if not mejor_opcion:
        mejor_opcion = random.choice(restaurantes_data)

    # Formateamos la respuesta final
    nombre_final = mejor_opcion.get('name', 'el restaurante')
    categoria_final = mejor_opcion.get('category', 'especialidades variadas')
    tags_final = str(mejor_opcion.get('tags', '')).replace("[", "").replace("]", "").replace("'", "")

    respuesta = (
        f"¡Hola! Como tu conserje de TableNow, te recomiendo visitar **{nombre_final}**. "
        f"Es una excelente opción de comida {categoria_final} y encaja con lo que buscas ({tags_final}). "
        f"\n\n- **TIP:** ¡Recuerda reservar con tiempo para asegurar la mejor mesa!"
    )

    return respuesta