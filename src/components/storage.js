export default{
	fetch:function(name,items){
		return JSON.parse(localStorage.getItem(name) || '[]')
	},
	save:function(name,items){
		localStorage.setItem(name,JSON.stringify(items))
	}
}