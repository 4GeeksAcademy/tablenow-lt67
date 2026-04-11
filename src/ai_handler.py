import random
import re

def limpiar_texto(texto):
    """Limpia el texto quitando signos de puntuación para no confundir a la IA."""
    texto_limpio = re.sub(r'[^\w\s]', '', str(texto or "").lower())
    return texto_limpio

def obtener_tip_adicional(categoria, tags, pregunta):
    """
    Analizador de Intención: Determina las acciones Pre y Post con precisión quirúrgica.
    """
    p = limpiar_texto(pregunta)
    
    # Prioridad 1: Negocios
    if any(word in p for word in ["negocios", "trabajo", "reunion", "cliente", "empresa", "oficina", "formal"]):
        return (
            "🎯 **Acción Estratégica:**\n"
            "Antes de llegar, te sugiero repasar los objetivos de la reunión. Este ambiente es ideal para cerrar acuerdos.\n\n"
            "📧 **Seguimiento:**\n"
            "Al finalizar, no olvides enviar un correo de agradecimiento; un buen gesto garantiza el éxito del cierre."
        )
    
    # Prioridad 2: Romántico
    if any(word in p for word in ["aniversario", "esposa", "romantico", "cita", "pareja", "novia", "velada"]):
        return (
            "🌹 **Detalle Sugerido:**\n"
            "Pasa por la floristería local antes de tu reserva. Un pequeño detalle eleva la experiencia.\n\n"
            "🎭 **Plan de Cierre:**\n"
            "Al salir, el área cuenta con zonas perfectas para una caminata tranquila o tomar una copa de vino."
        )
    
    # Prioridad 3: Amigos / Social
    if any(word in p for word in ["amigos", "cumpleaños", "grupo", "fiesta", "parche", "celebrar"]):
        return (
            "🚗 **Logística de Grupo:**\n"
            "Para mayor comodidad, coordinen llegar en conjunto o utilicen transporte privado.\n\n"
            "🍹 **After-Party:**\n"
            "El ambiente se presta para extender la conversación. Pregunta por la carta de coctelería para la sobremesa."
        )
        
    # Por defecto
    return (
        "💡 **Tip Pro:**\n"
        "Te sugerimos confirmar tu reserva 15 minutos antes de llegar.\n\n"
        "🚶‍♂️ **Ocio:**\n"
        "Explora los alrededores de la zona, suele tener una excelente oferta cultural y visual."
    )

def obtener_recomendacion_conserje(pregunta, restaurantes_data):
    """
    Motor de Inferencia Mejorado: Ahora detecta PLATILLOS específicos.
    """
    if not restaurantes_data:
        return "¡Hola! Soy tu Conserje TableNow. Estamos preparando el menú. Intenta en unos segundos."

    p_low = limpiar_texto(pregunta)
    puntuaciones = {}

    # Diccionario de Platillos Comunes vinculados a Categorías/Tags
    # Esto ayuda a la IA a saber que "Pasta" -> "Italiana"
    mapeo_platillos = {
        "pasta": ["italiana", "mediterranea", "pastas", "artesanal"],
        "pizza": ["pizza", "italiana", "leña"],
        "hamburguesa": ["hamburguesas", "american", "fast food", "grill"],
        "sushi": ["japonesa", "sushi", "asiatica", "oriental"],
        "carne": ["parrilla", "steakhouse", "carnes", "grill"],
        "tacos": ["mexicana", "tacos", "picante"],
        "ensalada": ["saludable", "vegan", "vegetariano", "light"],
        "mariscos": ["mariscos", "pescado", "mar", "ceviche"]
    }

    # Detectar si el usuario mencionó un platillo específico
    platillo_detectado = None
    for platillo in mapeo_platillos:
        if platillo in p_low:
            platillo_detectado = platillo
            break

    for i, rest in enumerate(restaurantes_data):
        score = 0
        nombre = str(rest.get('nombre') or '').lower()
        cat = str(rest.get('categoria') or '').lower()
        tag = str(rest.get('tags') or '').lower()
        info_total = f"{nombre} {cat} {tag}"

        # 1. PLUS POR PLATILLO (Si el usuario pidió 'Pasta' y el rest es 'Italiano', ¡Boom!)
        if platillo_detectado:
            # Si el platillo está literalmente en la info del rest
            if platillo_detectado in info_total:
                score += 30
            # Si la categoría del rest coincide con las categorías del platillo
            for cat_relacionada in mapeo_platillos[platillo_detectado]:
                if cat_relacionada in cat:
                    score += 25

        # 2. Match General de Palabras
        palabras_pregunta = p_low.split()
        for palabra in palabras_pregunta:
            if len(palabra) > 3:
                if palabra in cat: score += 10
                if palabra in tag: score += 5
                if palabra in nombre: score += 8

        # 3. Contexto (Negocios, Romántico, etc.)
        if "romantico" in p_low and ("elegante" in info_total or "romantico" in info_total): score += 15
        if "negocios" in p_low and ("formal" in info_total or "negocios" in info_total): score += 15
        
        puntuaciones[i] = score

    # Selección del mejor
    mejor_indice = max(puntuaciones, key=puntuaciones.get)
    mejor_opcion = restaurantes_data[mejor_indice]

    if puntuaciones[mejor_indice] == 0:
        mejor_opcion = random.choice(restaurantes_data)

    nombre_f = str(mejor_opcion.get('nombre') or 'un lugar excepcional')
    cat_f = str(mejor_opcion.get('categoria') or 'Gastronomía variada')
    tags_f = str(mejor_opcion.get('tags') or '').replace("[", "").replace("]", "").replace("'", "")
    
    tip = obtener_tip_adicional(cat_f, tags_f, pregunta)

    # Construcción de la respuesta con mención al platillo si existe
    mencion_platillo = ""
    if platillo_detectado:
        mencion_platillo = f"Como tienes antojo de **{platillo_detectado}**, este restaurante es tu mejor opción.\n\n"

    return (
        f"🎩 **Conserje TableNow:**\n\n"
        f"He analizado tu solicitud meticulosamente.\n\n"
        f"{mencion_platillo}"
        f"El lugar que mejor se adapta a ti es **{nombre_f}**.\n\n"
        f"**¿Por qué este lugar?**\n"
        f"Es referente en cocina **{cat_f}** y su ambiente de **{tags_f}** garantiza que disfrutarás cada bocado.\n\n"
        f"✨ **Protocolo de Experiencia Sugerido:**\n\n"
        f"{tip}"
    ) 