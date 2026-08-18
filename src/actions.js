module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		let model = self.config.model;

		actions.xpt = {
			name: 'Bus crosspoint control',
			options: [
				{
					label: 'BUS',
					type: 'dropdown',
					id: 'bus',
					choices: self[model + '_BUS'],
					default: self[model + '_BUS'][0].id,
				},
				{
					label: 'Input',
					type: 'dropdown',
					id: 'input',
					choices: self[model + '_INPUTS'],
					default: self[model + '_INPUTS'][0].id,
				},
			],
			callback: async function (action) {
				self.sendCommand('SBUS:' + action.options.bus + ':' + action.options.input);
			}
		};

		actions.auto = {
			name: 'Send AUTO transition',
			options: [
				{
					label: 'Target',
					type: 'dropdown',
					id: 'target',
					choices: self[model + '_TARGETS'],
					default: self[model + '_TARGETS'][0].id,
				},
			],
			callback: async function (action) {
				// VS-R45 / AUXP_IP (HS450) and HS50 use SAUT:<target>:<op> (2 fields).
				// HS410_IF / UHS500 use SAUT:<target>:<effect>:<op> (3 fields).
				if (self.config.model == 'HS50' || self.config.model == 'HS450') {
					self.sendCommand('SAUT:' + action.options.target + ':0');
				} else {
					self.sendCommand('SAUT:' + action.options.target + ':0:0');
				}
			}
		};

		actions.auto2 = {
			name: 'Send AUTO transition (2)',
			options: [
				{
					label: 'Target',
					type: 'dropdown',
					id: 'target',
					choices: self[model + '_TARGETS'],
					default: self[model + '_TARGETS'][0].id,
				},
			],
			callback: async function (action) {
				self.sendCommand('SAUT:' + action.options.target + ':0');
			}
		};

		actions.cut = {
			name: 'Send CUT transition',
			options: [
				{
					label: 'Target',
					type: 'dropdown',
					id: 'target',
					choices: self[model + '_CUTTARGETS'],
					default: self[model + '_CUTTARGETS'][0].id,
				},
			],
			callback: async function (action) {
				self.sendCommand('SCUT:' + action.options.target);
			}
		};

		if (model != 'HS50' && model != 'HS450') {
			actions.time = {
				name: 'Auto transition time control (HS410/UHS500)',
				options: [
					{
						label: 'Target',
						type: 'dropdown',
						id: 'target',
						choices: self[model + '_TARGETS'],
						default: self[model + '_TARGETS'][0].id,
					},
					{
						label: 'Time (in number of frames)',
						type: 'textinput',
						id: 'frames',
						regex: '/^0*([0-9]|[1-8][0-9]|9[0-9]|[1-8][0-9]{2}|9[0-8][0-9]|99[0-9])$/',
					},
				],
				callback: async function (action) {
					if (parseInt(action.options.frames) > 999) {
						action.options.frames = 999;
					}
					self.sendCommand('STIM:' + action.options.target + ':' + ('000' + parseInt(action.options.frames)).substr(-3));
				}
			};
		}

		self.setActionDefinitions(actions);
	}
}