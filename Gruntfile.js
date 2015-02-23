module.exports = function( grunt ) {
	
	grunt.initConfig({
		
		// Build backbone app
		
		shell: {
			target: {
				command: 'ant'
			}
		},
		
		
		// Watch for changes and then rebuild
		
		watch: {
			files: ['app/**/*.js','css/**/*.css'],
		  tasks: ['shell' ]
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.registerTask('default', [ 'shell', 'watch' ]);
}