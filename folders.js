const fileSystem = require('fs')
const string = require('./util')

const navigation = {
	cd: (options) => {
		const pathSegments = currentDirectory.split('\\')
		const newPathSegments = options[1].split('\\')

		for (const directory in newPathSegments) {
			if (newPathSegments[directory] === '..') {
				pathSegments.pop()
			} else {
				pathSegments.push(newPathSegments[directory])
			}
		}

		const newPath = pathSegments.join('\\')
		if (fileSystem.existsSync(newPath)) {
			globalThis.currentDirectory = `${pathSegments.join('\\')}`
		} else {
			console.log('Path not found.')
		}
	},

	dir: (options) => {
		const flags = options.filter((part) => part.startsWith('-'))

		if (currentDirectory === 'C:') globalThis.currentDirectory += '\\'

		fileSystem.readdir(currentDirectory, { withFileTypes: true }, (err, paths) => {
			paths.forEach((segment) => {
				if (options[1] === undefined) {
					console.log(segment.name)
				}

				if (flags.includes('-info')) {
					console.log(
						`name: ${segment.name}
              | parent_path: ${segment.parentPath}
              | is_symbolic_link: ${segment.isSymbolicLink()}
              | is_socket: ${segment.isSocket()}
              | is_file: ${segment.isFile()}
              | is_FIFO: ${segment.isFIFO()}
              | is_directory: ${segment.isDirectory()}
              | is_character_device: ${segment.isCharacterDevice()}
              | is_block_device: ${segment.isBlockDevice()}\n`
					)
				} else if (
					(segment.isFile() && flags.includes('-file')) ||
					(segment.isSymbolicLink() && flags.includes('-hidden'))
				) {
					console.log(segment.name)
				} else {
					if (!segment.isSymbolicLink && !segment.isFile()) {
						console.log(segment.name)
					}
				}
			})
		})

		globalThis.currentDirectory.replaceAll('\\\\', '\\')
		// if (currentDirectory === 'C:\\') {
		// }
	},

	mkdir: (name) => {
		if (!fileSystem.existsSync(`${currentDirectory}${name[1]}`)) {
			fileSystem.mkdirSync(`${currentDirectory}${name[1]}`, () => {
				console.log('Path successfully created.')
			})
		} else {
			console.log('Path/folder already exists.')
		}
	},
}

module.exports = navigation
