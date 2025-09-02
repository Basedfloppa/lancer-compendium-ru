Hooks.once('init', () => {

	if(typeof Babele !== 'undefined') {

		Babele.get().register({
			module: 'lancer-compendium-ru',
			lang: 'ru-ru',
			dir: 'compendium'
		});

		Babele.get().registerConverters({
			"nameShunt": nameShunt,
			"generalConverter": generalConverter
		});
	}
});

function nameShunt(value, _trans, data, compendium) {
	const id = data._id;
	const name = data.name;
	const type = data.type;
	
	// Check TranslationEntry
	let entry = (compendium.translations[name] || compendium.translations[id]);
	if (!entry) return value;

	if (entry.name) {
		return entry.name;
	}
	if (type && entry[type]) {
		return entry[type];
	}
	return name;
}

function generalConverter(system, _trans, data, compendium) {
	const id = data._id;
	const name = data.name;
	
	// Check TranslationEntry
	let entry = (compendium.translations[name] || compendium.translations[id]);
	if (!entry) return system;

	// Copy ReturnValue
	let retObj = Object.assign({}, system);
	
	// LID Shunt
	const lid  = system.lid;
	if (entry[lid]) {
		return objectConvert(retObj, entry[lid]);
	}
	return objectConvert(retObj, entry);
}

function objectConvert(source, translate) {
	if (translate == undefined) return source;
	
	for (const key of Object.keys(translate)) {
		if (source[key] == undefined) {
			continue;
		}

		if (Array.isArray(source[key])) {
			for (const entry of source[key]) {
				objectConvert(entry, translate[key][entry.name]);
			}
		} else if (typeof source[key] === "object") {
			objectConvert(source[key], translate[key]);
		} else {
			source[key] = translate[key];
		}
	}
	return source;
}