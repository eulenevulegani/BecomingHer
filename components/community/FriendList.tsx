import { GlassView, SerifText } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MOCK_FRIENDS = [
    { id: '1', name: 'Sarah', level: 12, image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: '2', name: 'Jessica', level: 8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '3', name: 'Emily', level: 15, image: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
    { id: '4', name: 'Maya', level: 5, image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
];

export function FriendList() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SerifText style={styles.title}>The Sisterhood</SerifText>
                <TouchableOpacity style={styles.addButton}>
                    <Plus size={16} color={Colors.brand.primary} />
                    <Text style={styles.addText}>Add Friend</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {MOCK_FRIENDS.map((friend) => (
                    <GlassView key={friend.id} intensity={10} style={styles.friendCard}>
                        <Image source={{ uri: friend.image }} style={styles.avatar} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{friend.level}</Text>
                        </View>
                        <Text style={styles.name}>{friend.name}</Text>
                        <Text style={styles.status}>Online</Text>
                    </GlassView>
                ))}

                <TouchableOpacity style={styles.inviteCard}>
                    <View style={styles.inviteIcon}>
                        <Plus size={24} color="#FFF" />
                    </View>
                    <Text style={styles.inviteText}>Invite</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 20,
        color: '#FFF',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    addText: {
        fontSize: 12,
        color: Colors.brand.primary,
        fontWeight: '600',
    },
    scrollContent: {
        gap: 12,
    },
    friendCard: {
        width: 100,
        height: 130,
        borderRadius: 16,
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
        backgroundColor: '#333',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.brand.primary,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: 10,
        color: '#000',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
        marginBottom: 2,
    },
    status: {
        fontSize: 10,
        color: '#4ADE80', // Green for online
    },
    inviteCard: {
        width: 100,
        height: 130,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderStyle: 'dashed',
    },
    inviteIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    inviteText: {
        fontSize: 14,
        color: '#8E8E93',
    },
});
