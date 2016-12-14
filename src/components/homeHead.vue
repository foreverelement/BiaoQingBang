<template>
    <div class="home-head">
        <mu-appbar :title="title">
            <mu-icon-button icon='menu' slot="left" @click="drawerToggle" />
            <mu-icon-button icon="search" slot="right" @click="openSearch">
        </mu-appbar>
    </div>
</template>
<script>
export default {
    name: 'home-head',
    props: ['title'],
    data: function() {
        return {}
    },
    methods: {
        drawerToggle: function() {
            this.$emit('drawerToggle');
        },
        openSearch(){
            this.$emit('openSearch')
        }
    }
}
</script>
<style>
	.home-head{
		text-align: center;
	}
</style>