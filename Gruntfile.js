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
			files: [ 
				'app/**/*.js',
				'app/**/*.html',
				'css/**/*.css', 
				'config/**/*.js' 
			],
		  tasks: [ 'shell' ]
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.registerTask('default', [ 'shell', 'watch' ]);
}